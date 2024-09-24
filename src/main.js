import './css/styles.css';
import 'tippy.js/dist/tippy.css';
import './components/widget-tab.js';
import './components/mention-input.js';
// import { autorun } from 'mobx';

class WidgetBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // autorun(() => {
    this.render();
    // });
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      p {
        color: white;
        background-color: #666;
        padding: 5px;
      }

      .widget_box {
        background: #fff;
        width: 70vw;
        max-width: 1000px;
        height: 400px;
        border-radius: 30px;
        display: flex;
        flex-direction: column;
        padding: 3rem 2rem;
      }

      ::slotted(*) {
              height: 100%;
          }
    </style>
    <div class="widget_box">
      <widget-tab>
        <mention-input></mention-input>
        </widget-tab>
    </div>
    `;
  }
}

customElements.define('widget-box', WidgetBox);

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = '<widget-box></widget-box>';
});
