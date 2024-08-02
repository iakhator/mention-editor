const template = document.createElement('template');
template.innerHTML = `
  <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/fontawesome.min.css"
    />
  <style>
    p {
      font-size: 30px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    p > span {
        font-weight: bold;

    }

    :host {
        display: block;
        height: calc(100% - 400px);
    }
    
    .mention-wrapper {
      display: grid;
      grid-template-rows: 20% auto 20%;
      gap: 0.5rem;
      height: 100%;
    }

    .mention-wrapper__input {
      border: 2px solid #d8d8d8;
      border-radius: 20px;
      display:flex;
      flex-direction: column;
      max-height: 100%; 
      overflow-y: auto;
    }

  .mention-wrapper__input-button {
      padding: 20px 0px 20px 20px;
    }

    .mention-wrapper__input-textarea {
      // white-space: pre-wrap;
      padding: 0px 20px 20px 20px;
      height: 40%;
      overflow-y: auto;
      overflow-wrap: break-word;
    }

     .mention-wrapper__input-textarea:empty::before {
      content: attr(data-placeholder);
      color: #d8d8d8;
      pointer-events: none;
      position: absolute;
    }

    .mention-wrapper__input-textarea:focus {
      outline: none;
    }

    .suggestion-box {
      border: 3px solid #75AABE;
    }

    .mention {
      background-color: yellow;
      border-radius: 4px;
      padding: 2px 4px;
    }

    .mention-wrapper__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .icon-button {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #49A0CE;
      background: #e1e2e2;
      font-size: 1.25rem;
      cursor: pointer;
    }
    .tippy-box[data-theme~="mention-light"] {
      background-color: #ffffff; 
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      border-radius:10px;
      width: 350px;
      max-height: 200px;
      overflow-y: auto;
      font-size: 0.875rem;
    }

    .tippy-box[data-theme~="mention-light"] .suggestion-item {
      padding: 0.7rem 1rem;
      cursor: pointer;
    }

    .tippy-box[data-theme~="mention-light"] .suggestion-item:hover {
      background: #0781C6;
      color: #fff;
    }

    .tippy-box[data-theme~="mention-light"] .suggestion-item:first-child:hover {
        border-top-left-radius: 10px; 
        border-top-right-radius: 10px; 
    }

  .tippy-box[data-theme~="mention-light"] .suggestion-item:last-child:hover {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
  }

  .tippy-box[data-theme~="emoji-light"] {
      background-color: #ffffff; 
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      border-radius:10px;
      width: 220px;
      max-height: 200px;
      overflow-y: auto;
      font-size: 0.875rem;
      display: flex;
    }
    
    .tippy-box[data-theme~="emoji-light"] .tippy-content{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

  // [contenteditable=true] {
  //   white-space: pre-wrap
  // }
  </style>
  <div class="mention-wrapper">
    <p><span>94</span> Points To Award</p>
    <div class="mention-wrapper__input">
      <div class="mention-wrapper__input-button">
        <widget-button buttonStyle='{"padding": "8px 15px", "fontWeight": "600"}'>@Employee</widget-button>
      </div>
      <div id="mention-input" contenteditable="true" class="mention-wrapper__input-textarea" data-placeholder="Type your message here...">
      </div>
      </div>
      <div class="mention-wrapper__footer">
      <div role="button" class="icon-button" id="emoji-button"><i class="fa-regular fa-face-smile"></i></div>
      <widget-button disabled buttonStyle='{"fontSize": "20px", "padding": "10px 30px"}'>Send Bravo!</widget-button>
      </div>
      </div>
      `;

// <div id="tippy-emoji" class="emoji-picker"></div>
// <div id="tippy-reference" class="tippy-reference"></div>
class MentionInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.mentions = [
      { firstname: 'Alice', lastname: 'James' },
      { firstname: 'Babara', lastname: 'Newton' },
      { firstname: 'Bob', lastname: 'Skelly' },
      { firstname: 'Charlie', lastname: 'BK' },
      { firstname: 'Dave', lastname: 'Nonty' },
      { firstname: 'Eve', lastname: 'Acapella' },
      { firstname: 'Frank', lastname: 'Johnson' },
      { firstname: 'Grace', lastname: 'Lee' },
      { firstname: 'Hank', lastname: 'Green' },
      { firstname: 'Ivy', lastname: 'Turner' },
      { firstname: 'Jack', lastname: 'White' },
      { firstname: 'Kate', lastname: 'Brown' },
      { firstname: 'Leo', lastname: 'Smith' },
      { firstname: 'Mia', lastname: 'Wilson' },
      { firstname: 'Nick', lastname: 'Davis' },
      { firstname: 'Olivia', lastname: 'Clark' },
      { firstname: 'Paul', lastname: 'Lewis' },
      { firstname: 'Quinn', lastname: 'Walker' },
      { firstname: 'Rachel', lastname: 'Harris' },
      { firstname: 'Steve', lastname: 'King' },
    ];
    this.emojis = [
      { emoji: '😀', keywords: ['grinning', 'happy', 'smile'] },
      { emoji: '😁', keywords: ['grinning', 'smile', 'happy', 'eyes'] },
      { emoji: '😂', keywords: ['joy', 'tears', 'happy', 'funny'] },
      { emoji: '🤣', keywords: ['rofl', 'rolling', 'floor', 'laughing'] },
      { emoji: '😃', keywords: ['smiling', 'happy', 'joy', 'smile'] },
      { emoji: '😄', keywords: ['smiling', 'eyes', 'happy', 'joy'] },
      { emoji: '😅', keywords: ['grinning', 'sweat', 'nervous', 'happy'] },
      { emoji: '😆', keywords: ['laughing', 'satisfied', 'happy'] },
      { emoji: '😉', keywords: ['wink', 'flirty', 'playful'] },
      { emoji: '😊', keywords: ['blush', 'smile', 'happy', 'shy'] },
      { emoji: '😋', keywords: ['yum', 'tongue', 'happy'] },
      { emoji: '😎', keywords: ['cool', 'sunglasses', 'happy'] },
      { emoji: '😍', keywords: ['heart', 'eyes', 'love', 'happy'] },
      { emoji: '😘', keywords: ['kiss', 'heart', 'love', 'happy'] },
      { emoji: '😗', keywords: ['kiss', 'happy', 'love'] },
      { emoji: '😙', keywords: ['kiss', 'smile', 'happy'] },
      { emoji: '😚', keywords: ['kiss', 'closed', 'eyes', 'happy'] },
      { emoji: '🙂', keywords: ['slightly', 'smiling', 'happy'] },
      { emoji: '🤗', keywords: ['hugging', 'hands', 'happy'] },
      { emoji: '🤔', keywords: ['thinking', 'thoughtful', 'pensive'] },
      { emoji: '😐', keywords: ['neutral', 'meh', 'indifferent'] },
      { emoji: '😑', keywords: ['expressionless', 'blank'] },
      { emoji: '😶', keywords: ['speechless', 'no', 'mouth'] },
      { emoji: '🙄', keywords: ['eyeroll', 'sarcastic', 'annoyed'] },
      { emoji: '😏', keywords: ['smirking', 'smug', 'sly'] },
      { emoji: '😣', keywords: ['persevering', 'struggling', 'uncomfortable'] },
      { emoji: '😥', keywords: ['sad', 'crying', 'disappointed'] },
      { emoji: '😮', keywords: ['surprised', 'shocked', 'wow'] },
      { emoji: '🤐', keywords: ['zipper', 'mouth', 'silent'] },
      { emoji: '😯', keywords: ['hushed', 'quiet', 'surprised'] },
      { emoji: '😪', keywords: ['sleepy', 'tired', 'drowsy'] },
      { emoji: '😫', keywords: ['tired', 'exhausted', 'weary'] },
      { emoji: '😴', keywords: ['sleeping', 'zzz', 'tired'] },
      { emoji: '😌', keywords: ['relieved', 'content', 'calm'] },
      { emoji: '🤓', keywords: ['nerd', 'glasses', 'smart'] },
      { emoji: '😛', keywords: ['tongue', 'playful', 'silly'] },
      { emoji: '😜', keywords: ['winking', 'tongue', 'playful'] },
      { emoji: '😝', keywords: ['tongue', 'closed', 'eyes', 'playful'] },
    ];

    this.input = this.shadowRoot.getElementById('mention-input');
    this.emojiButton = this.shadowRoot.getElementById('emoji-button');

    this.tippyReference = this.shadowRoot.getElementById('tippy-reference');
    this.emojiReference = this.shadowRoot.getElementById('tippy-emoji');

    this.input.addEventListener('keyup', this.onKeyUp.bind(this));
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('keydown', this.onKeyDown.bind(this));

    this.emojiButton.addEventListener('click', this.showEmojiPicker.bind(this));

    this.tippyInstance = tippy(this.input, {
      content: '',
      allowHTML: true,
      trigger: 'manual',
      appendTo: 'parent',
      placement: 'bottom-start',
      interactive: true,
      theme: 'mention-light',
    });

    this.emojiInstance = tippy(this.input, {
      content: '',
      allowHTML: true,
      trigger: 'manual',
      appendTo: 'parent',
      placement: 'bottom-start',
      interactive: true,
      theme: 'emoji-light',
    });
  }

  connectedCallback() {
    const widgetButton = this.shadowRoot.querySelector('widget-button');
    widgetButton.addEventListener('handleClick', () => {
      this.placeCaretAtEnd(this.input);
      this.insertAtCaret('@');
      this.showSuggestions(this.mentions);
    });
  }

  disconnectedCallBack() {
    console.log('disconnectedCallBack');
    this.tippyInstance.destroy();
    this.emojiInstance.destroy();
  }

  insertNewLine() {
    const selection = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    const range = selection.getRangeAt(0);
    const br = document.createElement('br');
    range.deleteContents();
    range.insertNode(br);

    // Move the caret after the <br> tag
    range.setStartAfter(br);
    range.setEndAfter(br);

    selection.removeAllRanges();
    selection.addRange(range);

    this.input.focus();

    // Replace <br> tags with newline characters in textContent
    // const mentionInput = this.shadowRoot.getElementById('mention-input');
    // mentionInput.innerHTML = mentionInput.innerHTML.replace(/<br>/g, '\n');
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.tippyInstance.state.isVisible) {
        return;
      }
      this.insertNewLine();
    }
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        // Check if the caret is at the beginning of a text node
        if (
          startContainer.nodeType === Node.TEXT_NODE &&
          startOffset === startContainer.textContent.length
        ) {
          const parentElement = startContainer.parentElement;

          // Regex to match @mention
          const mentionRegex = /@\w+/;

          // Check if the parent element is a span with an @mention
          if (
            parentElement.tagName === 'SPAN' &&
            mentionRegex.test(parentElement.textContent) &&
            startOffset === parentElement.textContent.length
          ) {
            e.preventDefault();
            parentElement.remove();

            this.placeCaretAtEnd(this.input);

            return;
          }
        }
      }
    }
  }

  onKeyUp(e) {
    const cursorPos = this.getCaretPosition();
    const text = this.input.textContent.substring(0, cursorPos);
    const mentionMatch = text.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      const filteredMentions = this.mentions.filter(
        ({ firstname, lastname }) =>
          firstname.toLowerCase().startsWith(query.toLowerCase()) ||
          lastname.toLowerCase().startsWith(query.toLowerCase())
      );

      if (filteredMentions.length > 0) {
        this.showSuggestions(filteredMentions, cursorPos);
      } else {
        this.hideSuggestions();
      }
    } else {
      this.hideSuggestions();
    }
  }

  onInput() {
    this.tippyInstance.setProps({ reference: this.input });
  }

  showSuggestions(suggestions, cursorPos) {
    const suggestionsHTML = suggestions
      .map(
        ({ firstname, lastname }) => `
        <div class="suggestion-item">${firstname} ${lastname}</div>
      `
      )
      .join('');

    this.tippyInstance.setContent(suggestionsHTML);
    // Position the tippy-reference element at the location of the @ character
    this.positionTippyAtCaret(this.tippyInstance);
    this.tippyInstance.show();

    this.shadowRoot.querySelectorAll('.suggestion-item').forEach((item) => {
      item.addEventListener('click', () => {
        this.selectMention(item.textContent);
      });
    });
  }

  hideSuggestions() {
    this.tippyInstance.hide();
  }

  selectMention(mention) {
    const text = this.input.textContent;

    // Regular expression to find all @mentions
    const mentionRegex = /@(\w+\s*\w*)/g;

    // Replace all existing mentions with span tags
    const newText = text.replace(mentionRegex, (match) => {
      return `<span class="mention">${match}</span>`;
    });

    // Insert the selected mention at the current caret position
    const mentionWithSpace = `<span class="mention">@${mention}</span>&nbsp;`;

    // console.log(mentionWithSpace, 'mention with space');

    // Find the last @mention being typed and replace it with mentionWithSpace
    const textBeforeCursor = newText.replace(/@(\w*\s*\w*)$/, mentionWithSpace);

    console.log(textBeforeCursor, 'beforecursore');

    // Set the new content with mentions wrapped in span tags
    this.input.innerHTML = textBeforeCursor;

    // Move the caret to after the inserted mention
    const range = document.createRange();
    const sel = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();

    const lastMention = this.input.querySelector('span.mention:last-of-type');
    if (lastMention && lastMention.nextSibling) {
      range.setStartAfter(lastMention.nextSibling); // Move caret after the space
      range.setEndAfter(lastMention.nextSibling);
    } else {
      range.selectNodeContents(this.input);
      range.collapse(false); // Move caret to the end if no sibling found
    }
    this.placeCaretAtEnd(this.input);

    sel.removeAllRanges();
    sel.addRange(range);

    this.input.focus();
    this.hideSuggestions();
  }

  // selectMention(mention) {
  //   console.log(mention, 'mention');

  //   const newMention = {
  //     type: 'mention',
  //     attrs: {
  //       id: mention,
  //     },
  //     content: [
  //       {
  //         type: 'text',
  //         text: `@${mention}`,
  //       },
  //     ],
  //   };

  //   this.content.content.push(newMention);
  //   this.input.innerHTML = this.convertTiptapJsonToHtml(this.content);

  //   const range = document.createRange();
  //   const sel = this.shadowRoot.getSelection
  //     ? this.shadowRoot.getSelection()
  //     : document.getSelection();

  //   const lastMention = this.input.querySelector('span.mention:last-of-type');
  //   if (lastMention && lastMention.nextSibling) {
  //     range.setStartAfter(lastMention.nextSibling); // Move caret after the space
  //     range.setEndAfter(lastMention.nextSibling);
  //   } else {
  //     range.selectNodeContents(this.input);
  //     range.collapse(false); // Move caret to the end if no sibling found
  //   }
  //   this.placeCaretAtEnd(this.input);

  //   sel.removeAllRanges();
  //   sel.addRange(range);

  //   this.input.focus();
  //   this.hideSuggestions();
  // }

  getCaretPosition() {
    let caretPos = 0;
    const selection = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this.input);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretPos = preCaretRange.toString().length;
    }

    return caretPos;
  }

  insertAtCaret(text) {
    // Ensure the input is focused after inserting text
    this.input.focus();

    const sel = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    const range = sel.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move the caret to the end of the inserted text
    range.setStart(textNode, textNode.length);
    range.setEnd(textNode, textNode.length);
    // range.setStartAfter(textNode);
    // range.setEndAfter(textNode);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    const sel = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    sel.removeAllRanges();

    // Find the last text node within the element
    function getLastTextNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node;
      }
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const textNode = getLastTextNode(node.childNodes[i]);
        if (textNode) {
          return textNode;
        }
      }
      return null;
    }

    const lastTextNode = getLastTextNode(el);

    if (lastTextNode) {
      range.setStart(lastTextNode, lastTextNode.length);
      range.collapse(true);
      sel.addRange(range);
    } else {
      // If no text node is found, place caret at the end of the element
      range.selectNodeContents(el);
      range.collapse(false);
      sel.addRange(range);
    }
  }

  positionTippyAtCaret(instance) {
    const selection = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);

    const rect = range.getClientRects()[0];
    // console.log(selection, 'instance');
    // console.log(range.commonAncestorContainer, 'textcontent');
    if (!rect) return;

    const { top, left, height } = rect;
    const { scrollX, scrollY } = window;

    instance.setProps({
      getReferenceClientRect: () => ({
        width: 0,
        height: 0,
        top: top + scrollY + 20,
        bottom: top + height + scrollY,
        left: left + scrollX,
        right: left + scrollX,
      }),
    });
  }

  setCaretPosition(pos) {
    const range = document.createRange();
    const selection = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    let node = this.input;
    let nodes = node.childNodes;
    let chars = pos;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === Node.TEXT_NODE) {
        if (nodes[i].length >= chars) {
          range.setStart(nodes[i], chars);
          range.collapse(true);
          break;
        } else {
          chars -= nodes[i].length;
        }
      } else {
        node = nodes[i];
        nodes = node.childNodes;
        i = -1;
      }
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  // emoji

  showEmojiPicker() {
    const emojisHTML = this.emojis
      .map(
        (em) => `
              <div class="emoji-item" style="padding: 5px; cursor: pointer;">${em.emoji}</div>
            `
      )
      .join('');

    this.emojiInstance.setContent(emojisHTML);

    this.placeCaretAtEnd(this.input);
    this.positionTippyAtCaret(this.emojiInstance);
    this.emojiInstance.show();

    this.shadowRoot.querySelectorAll('.emoji-item').forEach((item) => {
      item.addEventListener('click', () => {
        this.insertEmoji(item.textContent);
      });
    });
  }

  insertEmoji(emoji) {
    const cursorPos = this.getCaretPosition();
    const text = this.input.innerHTML;
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);
    const newText = `${beforeCursor}<span class="emoji">${emoji}</span>${afterCursor}`;

    this.input.innerHTML = newText;
    // this.setCaretPosition(cursorPos + emoji.length);
    this.placeCaretAtEnd(this.input);
    this.hideSuggestions();
  }
}

customElements.define('mention-input', MentionInput);
