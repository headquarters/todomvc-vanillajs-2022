import { Todos } from "./js/store.js";

const getCountString = () => {
	return `<strong>${Todos.all("active").length}</strong> item${
		Todos.all("active").length < 2 ? "" : "s"
	} left`;
};

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .todo-count {
      float: left;
      text-align: left;
    }
    
    .todo-count strong {
      font-weight: 300;
    }
  </style>

  <span class="todo-count" data-todo="count">${getCountString()}</span>`;

export class TodoCount extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		Todos.addEventListener("save", () => {
			this.shadowRoot.querySelector('[data-todo="count"]').innerHTML = getCountString();
		});
	}

	disconnectedCallback() {
		// TODO: Todos.removeEventListener("save")
	}
}

customElements.define("todo-count", TodoCount);
