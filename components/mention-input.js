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
      gap: 1rem;
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

  </style>
  <div class="mention-wrapper">
    <p><span>94</span> Points To Award</p>
    <div class="mention-wrapper__input">
      <div class="mention-wrapper__input-button">
        <widget-button buttonStyle='{"padding": "8px 15px", "fontWeight": "600"}'>@Employee</widget-button>
      </div>
      <div id="textInput" contenteditable="true" class="mention-wrapper__input-textarea" data-placeholder="Type your message here..."></div>
      <div id="suggestion-box" class="suggestion-box"></div>
    </div>
    <div class="mention-wrapper__footer">
      <div role="button" class="icon-button"><i class="fa-regular fa-face-smile"></i></div>
      <widget-button disabled buttonStyle='{"fontSize": "20px", "padding": "10px 30px"}'>Send Bravo!</widget-button>
    </div>
  </div>
`;

class MentionInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.textInput = this.shadowRoot.getElementById('textInput');
    this.suggestionsBox = this.shadowRoot.getElementById('suggestion-box');
    this.suggestionsBox.style.display = 'none';

    this.handleHashTagClick = this.handleHashTagClick.bind(this);

    this.users = ['@john_doe', '@jane_smith', '@alice_wonder', '@bob_builder'];
  }

  connectedCallback() {
    const widgetButton = this.shadowRoot.querySelector('widget-button');
    widgetButton.addEventListener('handleClick', this.handleHashTagClick);
  }

  handleHashTagClick(event) {
    this.textInput.focus();
    const existingValue = this.textInput.innerHTML || '';
    console.log(existingValue, 'existing value');
    // this.textInput.value = existingValue + '@'
    this.textInput.value += '@';
    // this.textInput.innerHTML = "@"
    // this.textInput.innerHTML = existingValue + '@'

    this.showSuggestions();
    this.placeCaretAtEnd(this.textInput);
  }

  showSuggestions(query) {
    this.suggestionsBox.innerHTML = '';
    const filteredUsers = query
      ? this.users.filter((user) => user.includes(query))
      : this.users;

    filteredUsers.forEach((user) => {
      const div = document.createElement('div');
      div.classList.add('suggestion-item');
      div.textContent = user;
      div.addEventListener('click', () => this.selectSuggestion(user));
      this.suggestionsBox.appendChild(div);
    });

    this.suggestionsBox.style.display = 'block';
  }

  selectSuggestion(user) {
    const value = this.textInput.value;
    const atMentionMatch = value.match(/@\w*/);

    if (atMentionMatch) {
      console.log(atMentionMatch[0], 'user');
      const updatedValue = value.replace(
        atMentionMatch[0],
        `<span class="mention">${user}</span>`
      );
      // this.textInput.value = updatedValue;
      console.log(updatedValue, 'updatedValue');
      this.textInput.innerHTML = updatedValue;
      this.placeCaretAtEnd(this.textInput);
    }
    this.suggestionsBox.style.display = 'none';
  }

  placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

customElements.define('mention-input', MentionInput);
