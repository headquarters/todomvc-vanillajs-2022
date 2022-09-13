import { getURLHash } from "./js/helpers.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .filters {
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      right: 0;
      left: 0;
    }
    
    .filters li {
      display: inline;
    }
    
    .filters li a {
      color: inherit;
      margin: 3px;
      padding: 3px 7px;
      text-decoration: none;
      border: 1px solid transparent;
      border-radius: 3px;
    }
    
    .filters li a:hover {
      border-color: #DB7676;
    }
    
    .filters li a.selected {
      border-color: #CE4646;
    }

    @media (max-width: 430px) {
      .filters {
        bottom: 10px;
      }
    }
  </style>

  <ul class="filters" data-todo="filters">
    <li>
      <a class="selected" href="#/">All</a>
    </li>
    <li>
      <a href="#/active">Active</a>
    </li>
    <li>
      <a href="#/completed">Completed</a>
    </li>
  </ul>`;

export class TodoFilter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	toggleFilterSelection() {
    const filter = getURLHash();

		this.shadowRoot
			.querySelectorAll('[data-todo="filters"] a')
			.forEach((el) => el.classList.remove("selected"));
		this.shadowRoot
			.querySelector(`[data-todo="filters"] [href="#/${filter}"]`)
			.classList.add("selected");
	}

	connectedCallback() {
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.toggleFilterSelection();

		window.addEventListener("hashchange", this.toggleFilterSelection.bind(this));
	}

	disconnectedCallback() {
		window.removeEventListener("hashchange", this.toggleFilterSelection.bind(this));
	}
}

customElements.define("todo-filter", TodoFilter);
