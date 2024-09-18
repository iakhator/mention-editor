const template = document.createElement('template');
template.innerHTML = `
<style>
.group::after, .tabBlock-tabs::after {
  clear: both;
  content: "";
  display: table;
}

*, ::before, ::after {
  box-sizing: border-box;
}

p {
  padding: 5px;
}

a {
  text-decoration: none;
  color: #2C2C2C;
}

:host {
    display: block;
    height: 100%;
}

::slotted(*) {
    display: block;
    height: 100%;
}

@media screen and (min-width: 700px) {
  body {
    font-size: 137.5%;
  }
}

.unstyledList, .tabBlock-tabs {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tabBlock {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.tabBlock-tab {
  background-color: var(--white);
  color: #b5a8c5;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  float: left;
  padding: 0.625rem 1.25rem;
  position: relative;
  -webkit-transition: 0.1s ease-in-out;
          transition: 0.1s ease-in-out;
}

.tabBlock-tab::before, .tabBlock-tab::after {
  content: "";
  display: block;
  height: 4px;
  position: absolute;
  -webkit-transition: 0.1s ease-in-out;
          transition: 0.1s ease-in-out;
}
.tabBlock-tab::before {
  left: -2px;
  right: -2px;
  top: -2px;
}
.tabBlock-tab::after {
  background-color: transparent;
  bottom: -2px;
  left: 0;
  right: 0;
}

@media screen and (min-width: 700px) {
  .tabBlock-tab {
    padding: 1rem 2rem
  }
}
  
.tabBlock-tab.is-active {
  position: relative;
  color: #d8d8d8;
  z-index: 1;
  border-left-style: solid;
  border-right-style: solid;
  border-top: solid;
  border-width: 2px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
.tabBlock-tab.is-active::before {
  color: #d8d8d8;
}

.tabBlock-tab.is-active::after {
  background-color: var(--white);
}

.tabBlock-content {
  background-color: var(--white);
  border: 2px solid #d8d8d8;
  padding: 1.25rem;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  max-height: 90%;
  height: 90%;

}

.tabBlock-pane: {
  height: 100%;
  max-height: 100%;
}

.tabBlock-pane > :last-child {
  margin-bottom: 0;
}
</style>
<div class="tabBlock">
    <ul class="tabBlock-tabs">
      <li class="tabBlock-tab is-active">
        <a href="#">Bravo!Board</a>
      </li>
      <li class="tabBlock-tab">
        <a href="#">Community Connect</a>
      </li>
    </ul>
    <div class="tabBlock-content">
      <div class="tabBlock-pane" style="height: 100%; max-height: 100%">
        <slot>
      </div>
    </div>
</div>
`;

class WidgetTab extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('widget-tab', WidgetTab);
