const template = document.createElement('template');
template.innerHTML = `
  <style>
    .widget-button {
      background-color: #fff;
      border: 1px solid #BFBFBF;
      border-radius: 5rem;
      cursor: pointer;
    }

  .custom-button:hover {
    background-color: #0056b3;
  }

  button:disabled {
    background-color: #BEBEBE;
    border: none;
    color: #666666;
    cursor: not-allowed;
    opacity: 0.6;
  }
  </style>
  <button class="widget-button" id="btn"><slot></slot></button>
`;

class WidgetButton extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'button-style'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener('click', this.handleClick.bind(this));
    this.buttonElement = this.shadowRoot.querySelector('button');
  }

  handleClick() {
    const event = new CustomEvent('handleClick', {
      detail: null,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  connectedCallback() {
    this.updateDisabledState(this.hasAttribute('disabled'));
    this.updateButtonStyle(this.getAttribute('buttonStyle'));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(newValue, 'newValue');
    if (name === 'disabled') {
      this.updateDisabledState(newValue !== null);
    }

    if (name === 'button-style') {
      this.updateButtonStyle(newValue);
    }
  }

  updateDisabledState(isDisabled) {
    if (isDisabled) {
      this.buttonElement.setAttribute('disabled', '');
      this.buttonElement.classList.add('disabled');
    } else {
      this.buttonElement.removeAttribute('disabled');
      this.buttonElement.classList.remove('disabled');
    }
  }

  updateButtonStyle(styleString) {
    if (!styleString) return;

    try {
      const styleObject = JSON.parse(styleString);
      Object.keys(styleObject).forEach((key) => {
        this.buttonElement.style[key] = styleObject[key];
      });
    } catch (e) {
      console.error('Invalid buttonStyle JSON:', styleString);
    }
  }

  render() {
    return `
    <style>
      .widget-button {
        background-color: #fff;
        border: 1px solid #BFBFBF;
        border-radius: 5rem;
        cursor: pointer;
      }
  
    .custom-button:hover {
      background-color: #0056b3;
    }
  
    button:disabled {
      background-color: #BEBEBE;
      border: none;
      color: #666666;
      cursor: not-allowed;
      opacity: 0.6;
    }
    </style>
    <button class="widget-button" id="btn"><slot></slot></button>`;
  }
}

customElements.define('widget-button', WidgetButton);
