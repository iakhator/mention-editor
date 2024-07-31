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
  <button class="widget-button"><slot></slot></button>
`;

class WidgetButton extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM
    this.attachShadow({
      mode: 'open',
    });

    // Add click event listener
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener('click', this.handleClick.bind(this));
    this.buttonElement = this.shadowRoot.querySelector('button');
  }

  static get observedAttributes() {
    return ['disabled', 'buttonStyle'];
  }

  // Handle click event
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
    if (name === 'disabled') {
      this.updateDisabledState(newValue !== null);
    }

    if (name === 'buttonStyle') {
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

  updateButtonStyle(style) {
    if (style) {
      try {
        const styleObj = JSON.parse(style);
        for (const [key, value] of Object.entries(styleObj)) {
          this.buttonElement.style[key] = value;
        }
      } catch (e) {
        console.error('Invalid JSON for buttonStyle:', e);
      }
    } else {
      this.buttonElement.style = '';
      this.buttonElement.className = 'widget-button';
    }
  }
}

customElements.define('widget-button', WidgetButton);
