import { TodoInput } from "./TodoInput.js";
import { TodoCount } from "./TodoCount.js";
import { TodoList } from "./TodoList.js";
import { TodoToggleAll } from "./TodoToggleAll.js";
import { TodoClearCompleted } from "./TodoClearCompleted.js";
import { TodoFilter } from "./TodoFilter.js";
import { getURLHash } from "./js/helpers.js";
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

    .main {
      position: relative;
      z-index: 2;
      border-top: 1px solid #e6e6e6;
    }

    .footer {
      padding: 10px 15px;
      height: 20px;
      text-align: center;
      font-size: 15px;
      border-top: 1px solid #e6e6e6;
    }
    
    .footer:before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 50px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
                  0 8px 0 -3px #f6f6f6,
                  0 9px 1px -3px rgba(0, 0, 0, 0.2),
                  0 16px 0 -6px #f6f6f6,
                  0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 430px) {
      .footer {
        height: 50px;
      }
    }
  </style>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <todo-input></todo-input>
    </header>
    <section class="main" data-todo="main">
      <todo-toggle-all></todo-toggle-all>
      <todo-list filter=${getURLHash()}></todo-list>
    </section>
    <footer class="footer" data-todo="footer">
      <todo-count></todo-count>
      <todo-filter></todo-filter>
      <todo-clear-completed></todo-clear-completed>
    </footer>
  </section>`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  toggleVisibility() {
    this.shadowRoot.querySelector('[data-todo="main"').style.display = Todos.all().length > 0 ? "block" : "none";
    this.shadowRoot.querySelector('[data-todo="footer"').style.display = Todos.all().length > 0 ? "block" : "none";
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.toggleVisibility();

    Todos.addEventListener("save", () => {
			this.toggleVisibility();
		});

		window.addEventListener('hashchange', () => {
      this.shadowRoot.querySelector("todo-list").setAttribute("filter", getURLHash());
		});
  }
}

customElements.define("todo-app", TodoApp);
