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
}

const mentionableStore = new MentionableStore();
export default mentionableStore;
