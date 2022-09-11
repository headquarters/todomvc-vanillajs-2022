import { TodoInput } from "./TodoInput.js";
import { TodoCount } from "./TodoCount.js";
import { Todos } from "./js/store.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .todoapp {
      background: #fff;
      margin: 130px 0 40px 0;
      position: relative;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
                  0 25px 50px 0 rgba(0, 0, 0, 0.1);
    }
    
    .todoapp h1 {
      position: absolute;
      top: -140px;
      width: 100%;
      font-size: 80px;
      font-weight: 200;
      text-align: center;
      color: #b83f45;
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
    }
  </style>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <todo-input></todo-input>
    </header>

    <todo-count></todo-count>
  </section>`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Todos.addEventListener('save', () => {
    //   this.shadowRoot.replaceChild(template.content.cloneNode(true), this.shadowRoot.children[0]);
    // });
  }

  disconnectedCallback() {}
}

customElements.define("todo-app", TodoApp);
