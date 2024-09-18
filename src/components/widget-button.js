class WidgetButton extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'button-style'];
  }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });
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
    this.render();
    this.buttonElement = this.shadowRoot.getElementById('btn');
    this.addEventListener('click', this.handleClick.bind(this));

    this.updateDisabledState(this.hasAttribute('disabled'));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this.updateDisabledState(newValue !== null);
    }

    if (name === 'button-style') {
      this.render(newValue);
    }
  }

  updateDisabledState(isDisabled) {
    if (!this.buttonElement) return;
    if (isDisabled) {
      this.buttonElement.setAttribute('disabled', '');
      this.buttonElement.classList.add('disabled');
    } else {
      this.buttonElement.removeAttribute('disabled');
      this.buttonElement.classList.remove('disabled');
    }
  }

  render(style) {
    const bStyle = style ? style : this.getAttribute('button-style');
    this.shadowRoot.innerHTML = `
      <style>
    .widget-button {
      background-color: var(--white);
      border: 1px solid var(--border);
      border-radius: 5rem;
      cursor: pointer;
    }

    button:disabled {
      background-color: var(--disabled-bg);
      border: none;
      color: var(--disabled-color);
      cursor: not-allowed;
      opacity: 0.6;
    }
  </style>
  <button class="widget-button" id="btn" style="${bStyle}"><slot></slot></button>`;
  }
}

customElements.define('widget-button', WidgetButton);
