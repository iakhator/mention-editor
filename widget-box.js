const template = document.createElement('template');
template.innerHTML = `
<style>
  p {
    color: white;
    background-color: #666;
    padding: 5px;
  }

  .widget_box {
    background: #fff;
    width: 70vw;
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

class WidgetBox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('widget-box', WidgetBox);
