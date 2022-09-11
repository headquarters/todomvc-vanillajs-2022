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
			console.log("save called", Todos.all("active").length);
			// "re-renders", but the innerHTML string remains the same so it doesn't update with the correct values
			this.shadowRoot.querySelector('[data-todo="count"]').innerHTML = getCountString();
		});
	}

	disconnectedCallback() {
		/* do event listeners get cleaned up automatically when the shadowRoot is removed? */
	}
}

customElements.define("todo-count", TodoCount);
