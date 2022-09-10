import { Todos } from './js/store.js';

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .new-todo {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 24px;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      color: inherit;
      padding: 6px;
      border: 1px solid #999;
      box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .new-todo {
      padding: 16px 16px 16px 60px;
      height: 65px;
      border: none;
      background: rgba(0, 0, 0, 0.003);
      box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
    }

    .new-todo::placeholder {
      font-style: italic;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
  </style>

  <input
    placeholder="What needs to be done?"
    autofocus
    class="new-todo"
    data-todo="new"
  />`;

export class TodoInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot
      .querySelector('[data-todo="new"]')
      .addEventListener("keyup", (e) => this.submitTodo(e));
  }

  disconnectedCallback() { /* do event listeners get cleaned up automatically when the shadowRoot is removed? */ }

  submitTodo(e) {
    if (e.key === 'Enter' && e.target.value.length) {
      Todos.add({ title: e.target.value, completed: false, id: "id_" + Date.now() });
      e.target.value = '';
    }
  }
}

customElements.define("todo-input", TodoInput);
