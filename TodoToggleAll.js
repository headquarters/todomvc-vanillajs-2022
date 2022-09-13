import { Todos } from "./js/store.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
	.toggle-all {
		width: 1px;
		height: 1px;
		border: none; /* Mobile Safari */
		opacity: 0;
		position: absolute;
		right: 100%;
		bottom: 100%;
	}
	
	.toggle-all + label {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 45px;
		height: 65px;
		font-size: 0;
		position: absolute;
		top: -65px;
		left: -0;
	}
	
	.toggle-all + label:before {
		content: '❯';
		display: inline-block;
		font-size: 22px;
		color: #949494;
		padding: 10px 27px 10px 27px;
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg);
	}
	
	.toggle-all:checked + label:before {
		color: #484848;
	}

	:focus,
	.toggle:focus + label,
	.toggle-all:focus + label {
		box-shadow: 0 0 2px 2px #CF7D7D;
		outline: 0;
	}

	@media screen and (-webkit-min-device-pixel-ratio:0) {
		.toggle-all {
			background: none;
		}
	}
  </style>
  
  <input id="toggle-all" class="toggle-all" type="checkbox" ${Todos.isAllCompleted() ? "checked" : ""} data-todo="toggle-all" />
  <label for="toggle-all">Mark all as complete</label>`;

export class TodoToggleAll extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const toggleAll = this.shadowRoot.querySelector('[data-todo="toggle-all"]');

		Todos.addEventListener("save", this.toggleChecked.bind(this));

		toggleAll.addEventListener("click", () => {
			Todos.toggleAll();
		});
	}

	toggleChecked() {
		this.shadowRoot.querySelector('[data-todo="toggle-all"]').checked = Todos.isAllCompleted();
	}

	disconnectedCallback() {
		Todos.removeEventListener("save", this.toggleChecked.bind(this));
	}
}

customElements.define("todo-toggle-all", TodoToggleAll);
