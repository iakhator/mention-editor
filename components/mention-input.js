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
      padding: 23px;
      display:flex;
      flex-direction: column;
      gap :15px;
    }

    .mention-wrapper__input-textarea {
      resize: none;
      flex: 1;
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
      background: red;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  </style>
  <div class="mention-wrapper">
    <p><span>94</span> Points To Award</p>
    <div class="mention-wrapper__input">
      <div class="mention-wrapper__input-button">
        <widget-button buttonStyle='{"padding": "8px 15px", "fontWeight": "600"}'>@Employee</widget-button>
      </div>
      <div id="mention-input" contenteditable="true" class="mention-wrapper__input-textarea" data-placeholder="Type your message here..."></div>
      <div id="tippy-emoji" class="emoji-picker"></div>
      <div id="tippy-reference" class="tippy-reference"></div>
      </div>
      <div class="mention-wrapper__footer">
        <div role="button" class="icon-button" id="emoji-button"><i class="fa-regular fa-face-smile"></i></div>
        <widget-button disabled buttonStyle='{"fontSize": "20px", "padding": "10px 30px"}'>Send Bravo!</widget-button>
      </div>
  </div>
`;

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
    this.emojiButton.addEventListener('click', this.showEmojiPicker.bind(this));

    this.tippyInstance = tippy(this.tippyReference, {
      content: '',
      allowHTML: true,
      trigger: 'manual',
      appendTo: 'parent',
      placement: 'bottom-start',
      interactive: true,
      theme: 'mention-light',
    });

    this.emojiInstance = tippy(this.emojiReference, {
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
      this.onKeyUp();
    });
  }

  disconnectedCallBack() {
    console.log('disconnectedCallBack');
    this.tippyInstance.destroy();
    this.emojiInstance.destroy();
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
    const cursorPos = this.getCaretPosition();
    const text = this.input.textContent;

    // Regular expression to find all @mentions
    const mentionRegex = /@(\w+)/g;

    console.log(mention, 'mention', text, 'mention regex');

    const newText = text.replace(mentionRegex, (match, p1) => {
      return `<span class="mention">${match}</span>`;
    });

    // Insert a space after the mention
    const mentionWithSpace = `<span class="mention">@${mention}</span>&nbsp;`;
    const newTextWithSpace = newText.replace(/@(\w*)$/, mentionWithSpace);

    this.input.innerHTML = newTextWithSpace;
    // this.setCaretPosition(this.getCaretPosition() + mentionWithSpace.length);
    this.placeCaretAtEnd(this.input); // Focus the input after setting the caret position
    this.hideSuggestions();
  }

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
    const sel = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    const range = sel.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move the caret to the end of the inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);

    // Ensure the input is focused after inserting text
    this.input.focus();
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

  placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  positionTippyAtCaret(instance) {
    const selection = this.shadowRoot.getSelection
      ? this.shadowRoot.getSelection()
      : document.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);

    let { commonAncestorContainer } = range;

    // Ensure commonAncestorContainer is a text node
    if (commonAncestorContainer.nodeType !== Node.TEXT_NODE) {
      // If it's not a text node, find the first text node within it
      if (commonAncestorContainer.childNodes.length > 0) {
        commonAncestorContainer = commonAncestorContainer.childNodes[0];
        while (
          commonAncestorContainer &&
          commonAncestorContainer.nodeType !== Node.TEXT_NODE
        ) {
          commonAncestorContainer = commonAncestorContainer.nextSibling;
        }
      }
    }

    // If we couldn't find a text node, return
    if (
      !commonAncestorContainer ||
      commonAncestorContainer.nodeType !== Node.TEXT_NODE
    ) {
      return;
    }

    const rect = range.getClientRects()[0];
    // console.log(range, 'instance');
    // console.log(commonAncestorContainer.textContent, 'textcontent');
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

  // showEmojiPicker() {
  //   // Create the search input
  //   const searchInputHTML = `
  //     <div style="padding: 5px;">
  //       <input type="text" id="emoji-search-input" placeholder="Search emojis..." style="width: 100%; padding: 5px; border: 1px solid #d8d8d8; border-radius: 5px;">
  //     </div>
  //   `;

  //   // Create the initial emojis HTML
  //   const emojisHTML = this.emojis
  //     .map(
  //       (em) => `
  //         <div class="emoji-item" style="padding: 5px; cursor: pointer;">${em.emoji}</div>
  //       `
  //     )
  //     .join('');

  //   // Set the initial content of the tippy instance
  //   this.tippyInstance.setContent(searchInputHTML + emojisHTML);
  //   this.placeCaretAtEnd(this.input);

  //   this.positionTippyAtCaret();
  //   this.tippyInstance.show();

  //   // Add event listener to the search input
  //   const searchInput = this.shadowRoot.querySelector('#emoji-search-input');
  //   searchInput.addEventListener('input', (event) => {
  //     const query = event.target.value.toLowerCase();
  //     const filteredEmojisHTML = this.emojis
  //       .filter((em) => em.keywords.some((keyword) => keyword.includes(query)))
  //       .map(
  //         (em) => `
  //           <div class="emoji-item" style="padding: 5px; cursor: pointer;">${em.emoji}</div>
  //         `
  //       )
  //       .join('');

  //     // Update the tippy content with the filtered emojis
  //     this.tippyInstance.setContent(searchInputHTML + filteredEmojisHTML);

  //     // Add click event listeners to the filtered emojis
  //     this.shadowRoot.querySelectorAll('.emoji-item').forEach((item) => {
  //       item.addEventListener('click', () => {
  //         this.insertEmoji(item.textContent);
  //       });
  //     });
  //   });

  //   // Add click event listeners to the initial emojis
  //   this.shadowRoot.querySelectorAll('.emoji-item').forEach((item) => {
  //     item.addEventListener('click', () => {
  //       this.insertEmoji(item.textContent);
  //     });
  //   });
  // }
}

customElements.define('mention-input', MentionInput);
