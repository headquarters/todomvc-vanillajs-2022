import { Todos } from "./js/store.js";
import { delegate } from "./js/helpers.js";

const getTodos = () => {
	let markup = "";

	Todos.all().forEach((todo) => {
		markup += `
      <li data-id="${todo.id}" class="${todo.completed ? "completed" : ""}">
        <div class="view">
          <input data-todo="toggle" class="toggle" type="checkbox" ${
						todo.completed ? "checked" : ""
					}>
          <label data-todo="label">${todo.title}</label>
				  <button class="destroy" data-todo="destroy"></button>
        </div>
        <input class="edit" data-todo="edit" value="${todo.title}">
      </li>
    `;
	});

	return markup;
};

const template = document.createElement("template");
template.innerHTML = `
  <style>
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

    .edit {
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

    .todo-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    
    .todo-list li {
      position: relative;
      font-size: 24px;
      border-bottom: 1px solid #ededed;
    }
    
    .todo-list li:last-child {
      border-bottom: none;
    }
    
    .todo-list li.editing {
      border-bottom: none;
      padding: 0;
    }
    
    .todo-list li.editing .edit {
      display: block;
      width: calc(100% - 43px);
      padding: 12px 16px;
      margin: 0 0 0 43px;
    }
    
    .todo-list li.editing .view {
      display: none;
    }
    
    .todo-list li .toggle {
      text-align: center;
      width: 40px;
      /* auto, since non-WebKit browsers doesn't support input styling */
      height: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      border: none; /* Mobile Safari */
      -webkit-appearance: none;
      appearance: none;
    }
    
    .todo-list li .toggle {
      opacity: 0;
    }
    
    .todo-list li .toggle + label {
      /*
        Firefox requires '#' to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
        IE and Edge requires *everything* to be escaped to render, so we do that instead of just the '#' - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
      */
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
      background-repeat: no-repeat;
      background-position: center left;
    }
    
    .todo-list li .toggle:checked + label {
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
    }
    
    .todo-list li label {
      word-break: break-all;
      padding: 15px 15px 15px 60px;
      display: block;
      line-height: 1.2;
      transition: color 0.4s;
      font-weight: 400;
      color: #484848;
    }
    
    .todo-list li.completed label {
      color: #949494;
      text-decoration: line-through;
    }
    
    .todo-list li .destroy {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      font-size: 30px;
      color: #949494;
      transition: color 0.2s ease-out;
    }
    
    .todo-list li .destroy:hover,
    .todo-list li .destroy:focus {
      color: #C18585;
    }
    
    .todo-list li .destroy:after {
      content: '×';
      display: block;
      height: 100%;
      line-height: 1.1;
    }
    
    .todo-list li:hover .destroy {
      display: block;
    }
    
    .todo-list li .edit {
      display: none;
    }
    
    .todo-list li.editing:last-child {
      margin-bottom: -1px;
    }

    :focus,
    .toggle:focus + label,
    .toggle-all:focus + label {
      box-shadow: 0 0 2px 2px #CF7D7D;
      outline: 0;
    }
    
  </style>

  <ul class="todo-list" data-todo="list">${getTodos()}</ul>`;

export class TodoList extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		Todos.addEventListener("save", () => {
			this.shadowRoot.querySelector('[data-todo="list"]').innerHTML = getTodos();
		});

    const list = this.shadowRoot.querySelector('[data-todo="list"]');

    delegate(list, '[data-todo="destroy"]', "click", (e) => {
      const item = e.target.closest('[data-id]');
      const todo = Todos.get(item.dataset.id);
      Todos.remove(todo);
    });

    delegate(list, '[data-todo="toggle"]', "click", (e) => {
      const item = e.target.closest('[data-id]');
      const todo = Todos.get(item.dataset.id);
      Todos.toggle(todo);
    });

    delegate(list, '[data-todo="label"]', "dblclick", (e) => {
      const item = e.target.closest('[data-id]');
      item.classList.add("editing");
      item.querySelector('[data-todo="edit"]').focus();
    });

    delegate(list, '[data-todo="edit"]', "keyup", (e) => {
      const item = e.target.closest('[data-id]');
      const todo = Todos.get(item.dataset.id);
      const value = e.target.value;
			if (e.key === 'Enter' && value) {
        Todos.update({ ...todo, title: value });
        return;
      }
				
			if (e.key === 'Escape') {
				item.querySelector('[data-todo="edit"]').value = todo.title;
        Todos.revert();
			}
    });

    delegate(list, '[data-todo="edit"]', "focusout", (e) => {
      const item = e.target.closest('[data-id]');
      const todo = Todos.get(item.dataset.id);
      const title = item.querySelector('[data-todo="edit"]').value;
			Todos.update({ ...todo, title });
    });

	}

	disconnectedCallback() {
		// TODO: Todos.removeEventListener("save")
	}
}

customElements.define("todo-list", TodoList);
