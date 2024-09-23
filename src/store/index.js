import { makeAutoObservable } from 'mobx';
class MentionableStore {
  content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello, this is a simple example of TipTap JSON content.',
          },
        ],
      },
    ],
  };

  constructor() {
    makeAutoObservable(this);
  }

  setInputValue(value) {
    this.content = value;
  }

  separateMarks(input) {
    const matches = [];
    let currentIndex = 0;

    input.replace(matchMarkRegex, (match, delimiter, content, index) => {
      const textBeforeMatch = input.substring(currentIndex, index);
      if (textBeforeMatch) {
        matches.push(textBeforeMatch);
      }
      if (match.match(/\[\[@\w+\|\w+\]\]/g)) {
        matches.push(match);
      } else if (match.startsWith('@') || match.match(/\[.*?\]\(.*?\)/g)) {
        matches.push(match);
      } else {
        matches.push(`${delimiter}${content}${delimiter}`);
      }
      currentIndex = index + match.length;
    });

    const remainingText = input.substring(currentIndex);
    if (remainingText) {
      matches.push(remainingText);
    }
    return matches;
  }

  convertToTiptapJSON(text) {
    const sections = text?.split('\n'); // Split the text into sections based on double line breaks
    const tiptapJSON = {
      type: 'doc',
      content: [],
    };

    const applyMarks = (text) => {
      let currentLine = text.trim();
      const paragraphText = [];
      const match = currentLine.match(matchMarkRegex);

      if (match) {
        const marks = separateMarks(currentLine);
        for (const mark of marks) {
          if (mark.match(/\[\[@\w+\|\w+\]\]/)) {
            const id = mark
              .match(/\[\[@\w+\|\w+\]\]/)[0]
              ?.replace('[[@', '')
              ?.replace(']]', '')
              ?.split('|')[0];
            const user = mentionables.value[id];
            paragraphText.push({
              type: 'mention',
              attrs: { id: user },
              label: null,
            });
          } else {
            paragraphText.push({ type: 'text', text: mark });
          }
        }
      } else {
        paragraphText.push({ type: 'text', text: currentLine });
      }

      return {
        type: 'paragraph',
        content: paragraphText,
      };
    };
    if (!sections) {
      return tiptapJSON;
    }
    for (const section of sections) {
      if (section.startsWith('- ')) {
        // If the section starts with '-', it represents an ordered list
        const listItems = section
          .split('- ')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        tiptapJSON.content.push({
          type: 'bulletList',
          content: listItems.map((item) => ({
            type: 'listItem',
            content: [applyMarks(item)],
          })),
        });
      } else if (!section) {
        // If the section is empty, it represents a line break
        tiptapJSON.content.push({
          type: 'paragraph',
        });
      } else {
        // Otherwise, it represents a paragraph
        tiptapJSON.content.push(applyMarks(section));
      }
    }
    return tiptapJSON;
  }

  // use convertFromTiptapJSON(json.content)
  convertFromTiptapJSON(content) {
    let text = '';

    const processContent = (content) => {
      for (const contentItem of content) {
        if (contentItem.type === 'bulletList') {
          for (const listItem of contentItem.content) {
            text += `- ${processParagraph(listItem.content[0])}\n`;
          }
        } else if (contentItem.type === 'paragraph') {
          text += processParagraph(contentItem) + '\n';
        }
      }
    };

    const processParagraph = (paragraph) => {
      if (!paragraph.content) {
        return '';
      }

      return paragraph.content
        .filter((textNode) => textNode.type === 'text')
        .map((textNode) => textNode.text)
        .join(' ')
        .trim();
    };

    processContent(content);

    return text.trim();
  }

  convertHTMLToTiptapJSON(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const tiptapJSON = {
      type: 'doc',
      content: [],
    };

    const applyMarks = (node) => {
      const paragraphText = [];

      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          paragraphText.push({ type: 'text', text: child.textContent });
        } else if (child.nodeName === 'B' || child.nodeName === 'STRONG') {
          paragraphText.push({
            type: 'text',
            text: child.textContent,
            marks: [{ type: 'bold' }],
          });
        } else if (child.nodeName === 'I' || child.nodeName === 'EM') {
          paragraphText.push({
            type: 'text',
            text: child.textContent,
            marks: [{ type: 'italic' }],
          });
        } else if (child.nodeName === 'A') {
          paragraphText.push({
            type: 'text',
            text: child.textContent,
            marks: [
              { type: 'link', attrs: { href: child.getAttribute('href') } },
            ],
          });
        } else if (
          child.nodeName === 'SPAN' &&
          child.getAttribute('data-type') === 'mention'
        ) {
          const id = child.getAttribute('data-id');
          const user = mentionables.value[id]; // Assuming mentionables is available
          paragraphText.push({
            type: 'mention',
            attrs: { id: user },
            label: null,
          });
        }
      });

      return {
        type: 'paragraph',
        content: paragraphText,
      };
    };

    const handleNode = (node) => {
      switch (node.nodeName) {
        case 'P':
          tiptapJSON.content.push(applyMarks(node));
          break;
        case 'UL': {
          const listItems = Array.from(node.querySelectorAll('li')).map(
            (item) => ({
              type: 'listItem',
              content: [applyMarks(item)],
            })
          );
          tiptapJSON.content.push({
            type: 'bulletList',
            content: listItems,
          });
          break;
        }
        case 'OL': {
          const listItems = Array.from(node.querySelectorAll('li')).map(
            (item) => ({
              type: 'listItem',
              content: [applyMarks(item)],
            })
          );
          tiptapJSON.content.push({
            type: 'orderedList',
            content: listItems,
          });
          break;
        }
        case 'H1':
          tiptapJSON.content.push({
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: node.textContent }],
          });
          break;
        case 'H2':
          tiptapJSON.content.push({
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: node.textContent }],
          });
          break;
        case 'H3':
          tiptapJSON.content.push({
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: node.textContent }],
          });
          break;
        default:
          break;
      }
    };

    // Traverse the body of the parsed document
    doc.body.childNodes.forEach(handleNode);

    return tiptapJSON;
  }
}

const mentionableStore = new MentionableStore();
export default mentionableStore;
