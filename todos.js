class Todos {
    todo = [];
    constructor() {
      this.input = document.getElementById('todoInput');
      this.addBtn = document.getElementById('button');
      this.todoList = document.getElementById('todoList');
      this.getTodos();
      this.showTodosInConsole();
      this.addEventToButton();
    }

    getTodos() {
      fetch('http://localhost:3000/todos')
        .then(res => res.json())
        .then(data => {
          data.todos.forEach(todo => this.constructHTML(todo));
        })
    }

    constructHTML(todo) {
      let checked = '';
      let strikeThrough = '';
      if (todo.completed) {
        checked = 'checked';
        strikeThrough = 'text-decoration-line-through';
      }
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between p-3';
      li.setAttribute('data-id', `${todo._id}`);
      li.innerHTML = `<span>
                        <input type="checkbox" data-id = ${todo._id} ${checked} />
                        <div class="edit-input d-inline d-none">
                            <input type="text" placeholder="Updated value" />
                            <button class="btn btn-sm btn-primary" data-id = ${todo._id}>Update</button>
                            <button class="btn btn-sm btn-danger">Cancel</button>
                        </div>
                        <p class="todo-input d-inline ${strikeThrough}">${todo.name}</p>
                      </span>
                      <div>
                        <i class="bi bi-pencil-square px-1"></i>
                        <i class="bi bi-trash px-1" data-id = ${todo._id} ></i>
                      </div>`;
      todoList.append(li);
      const checkbox = li.querySelector('input[type="checkbox"]');
      const p = li.querySelector('p.todo-input');
      const edit = li.querySelector('div > i:first-child');
      const trash = li.querySelector('div > i:last-child');
      const editContainer = li.querySelector('.edit-input');
      const editInput = li.querySelector('.edit-input>input');
      const updateBtn = li.querySelector('.edit-input>button.btn-primary');
      const cancelBtn = li.querySelector('.edit-input>button.btn-danger');
      this.editTodo(edit, editInput, p);
      this.updateTodo(updateBtn, editInput, p);
      this.cancelUpdate(cancelBtn, editContainer, p);
      this.completeTodo(checkbox, p);
      this.removeTodo(trash, li);
    }

    showTodosInConsole() {
      fetch('http://localhost:3000/todos')
        .then(res => res.json())
        .then(data => console.log(data.todos))
    }

    addEventToButton() {
      this.addBtn.addEventListener('click', (e) => {
        const typedText = this.input.value.trim();
        if (typedText === '') {
          alert('Todo should not be empty')
        }
        else {
          fetch('http://localhost:3000/todo/add', {
            method: "POST",
            body: JSON.stringify({ name: typedText }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
          }).then(this.logTodosToConsole)
        }
      });
    }
    
    addTodo() {
      const typedText = this.input.value.trim();
      if (typedText === '') {
        alert('Todo should not be empty')
      } else {
          fetch('http://localhost:3000/todo/add', {
          method: "POST",
          body: JSON.stringify({ name: typedText }),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .then(this.showTodosInConsole)
      }
    }

    toggleUpdate(editContainer , p){
        p.classList.toggle('d-none');
        editContainer.classList.toggle('d-none');
    }

    editTodo(edit , editInput , p) {
        edit.addEventListener('click', () => {
            editInput.value = p.textContent;
            this.toggleUpdate(editInput.parentElement , p);
        });
    }

    updateTodo(updateBtn , editInput , p){
      updateBtn.addEventListener('click', () => {
        const updatedValue = editInput.value.trim();
        const todoID = updateBtn.dataset.id;
        if (updatedValue === '') {
          alert('Enter some todo item before adding');
        } else {
          fetch('http://localhost:3000/todo/update', {
            method: "PUT",
            body: JSON.stringify({ id: todoID, name: updatedValue }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
          }).then(() => {
            p.textContent = updatedValue;
            this.toggleUpdate(editInput.parentElement , p);
            this.showTodosInConsole();
          })
        }
      });
    }

    cancelUpdate(cancelBtn , editContainer , p){
      cancelBtn.addEventListener('click', () => {
        this.toggleUpdate(editContainer , p);
      });
    }

    completeTodo(checkbox , p){
      checkbox.addEventListener('change', (e) => {
        let completed;
        checkbox.checked ? completed = true : completed = false;
        const todoID = checkbox.dataset.id;
        fetch(`http://localhost:3000/todo/complete/${todoID}`, {
          method: "PUT",
          body: JSON.stringify({ completed }),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .then(() => {
          p.classList.toggle('text-decoration-line-through');
          this.showTodosInConsole();
        })
      });
    }

    removeTodo(trash , li) {
      trash.addEventListener('click', () => {

        fetch(`http://localhost:3000/todo/destroy/${li.dataset.id}`, {
          method: "DELETE",
        })
        .then(() => {
          li.remove();
          this.showTodosInConsole();
        });     
         
      });
    }
  }
  const todo = new Todos();