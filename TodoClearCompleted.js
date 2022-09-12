import { Todos } from "./js/store.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .clear-completed,
    html .clear-completed:active {
      float: right;
      position: relative;
      line-height: 19px;
      text-decoration: none;
      cursor: pointer;
      display: ${Todos.hasCompleted() ? "block" : "none"}
    }

    .clear-completed:hover {
      text-decoration: underline;
    }

    button {
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      font-size: 100%;
      vertical-align: baseline;
      font-family: inherit;
      font-weight: inherit;
      color: inherit;
      -webkit-appearance: none;
      appearance: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
  </style>
  
  <button class="clear-completed" data-todo="clear-completed">Clear completed</button>`;

export class TodoClearCompleted extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const clearCompleted = this.shadowRoot.querySelector('[data-todo="clear-completed"]');

		Todos.addEventListener("save", () => {
			clearCompleted.style.display = Todos.hasCompleted() ? "block" : "none"
		});

    clearCompleted.addEventListener("click", () => {
      Todos.clearCompleted();
    })
	}

	disconnectedCallback() {
		// TODO: Todos.removeEventListener("save")
	}
}

customElements.define("todo-clear-completed", TodoClearCompleted);
