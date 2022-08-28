class Todo {
    
    constructor(){
    this.inputValue = document.querySelector('#todoInput');
    this.addBtn = document.querySelector('#button');
    this.todoList = document.querySelector('#todoList');
    this.logTodosToConsole();
    this.getTodos();
    this.addEventToButton();
    }

    logTodosToConsole(){
        fetch('http://localhost:3000/todos')
            .then(res => res.json())
            .then(data => console.log(data.todos))
    }

    getTodos(){
        fetch('http://localhost:3000/todos')
            .then(res => res.json())
            .then(data => {
                data.todos.forEach( todo => this.constructHTML(todo.name , todo.completed , todo._id));
            })
    }
    constructHTML(typedText , completed = false , id = ''){
        let checkbox = `<input type="checkbox" data-id="${id}" />`;
        let strikeThrough = '';
        if (completed){
            checkbox = `<input type="checkbox" data-id="${id}" checked  />`;
            strikeThrough = 'text-decoration-line-through';
        }
        const li = document.createElement('li');
        li.setAttribute('data-id', `${id}`);
        li.className = 'list-group-item d-flex justify-content-between p-3';
        li.innerHTML = `<span>
                            ${checkbox}
                            <div class="edit-input d-inline d-none">
                                <input type="text" placeholder="Enter value" />
                                <button class="updateBtn btn btn-sm btn-primary" data-id="${id}">Update</button>
                                <button class="cancelBtn btn btn-sm btn-danger">Cancel</button>
                            </div>
                            <p class="todo-input d-inline ${strikeThrough}">${typedText}</p>
                        </span>
                        <div>
                            <i class="bi bi-pencil-square px-1"></i>
                            <i class="bi bi-trash px-1"></i>
                        </div>`;
        todoList.append(li);
    }

    addEventToButton() {
        this.addBtn.addEventListener('click', (e) => {
            // e.preventDefault();
            this.addTodo();
            this.inputValue.value = '';
        });
    }


    addTodo() {
        const typedText = this.inputValue.value.trim();
        if (typedText === '') {
            alert('Todo should not be empty')
        } 
        else {
            // this.constructHTML(typedText);
            fetch('http://localhost:3000/todo/add', {
                method: "POST",
                body: JSON.stringify({ name: typedText}),
                headers: { "Content-type": "application/json; charset=UTF-8"  }
            }).then(this.logTodosToConsole)
        }
    }

    removeTodo(trash) {
       const todo = trash.closest('.list-group-item');
        fetch(`http://localhost:3000/todo/destroy/${todo.dataset.id}`, {
            method: "DELETE",
        }).then(() => {
            todo.remove();
            this.logTodosToConsole();
        });     
    }
    
    editTodo(editInput , p) {
        editInput.value = p.textContent.trim();.0
        this.toggleEditContainer(editInput.parentElement , p);
    }
    
    toggleEditContainer (editContainer , p){
        p.classList.toggle('d-none');
        editContainer.classList.toggle('d-none');
    };

    updateTodo(p , todoID , updatedValue){
        fetch('http://localhost:3000/todo/update', {
            method: "PUT",
            body: JSON.stringify({ id: todoID , name : updatedValue }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(() => {
            p.textContent = updatedValue;
            this.toggleEditContainer(p.previousElementSibling , p);
            this.logTodosToConsole();
        })
    }

    check(checkbox , p ){
        let completed;
        checkbox.checked ? completed = true : completed = false;
        const todoID = checkbox.dataset.id;
        fetch(`http://localhost:3000/todo/complete/${todoID}`, {
            method: "PUT",
            body: JSON.stringify({ completed}),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .then(() => {
            p.classList.toggle('text-decoration-line-through');
            this.logTodosToConsole();
        })
        
    }

}

const todo = new Todo();

todoList.addEventListener('click' , e => {
    
    // === Remove === //
    if (e.target.classList.contains('bi-trash')){
        todo.removeTodo(e.target);
    }

    // === Edit === //
    if (e.target.classList.contains('bi-pencil-square')) {
        const li = e.target.closest('.list-group-item');
        const editInput = li.querySelector('.edit-input>input');
        const p = li.firstElementChild.lastElementChild;
        todo.editTodo(editInput , p);
    }

    // === Update === //
    if (e.target.classList.contains('updateBtn')) {
        const p = e.target.parentElement.nextElementSibling;
        const updatedValue = e.target.previousElementSibling.value.trim();
        const todoID = e.target.dataset.id;
        updatedValue ? todo.updateTodo(p, todoID , updatedValue ) : alert('Value Cannot be Null');
    }

    // === Cancel === //
    if (e.target.classList.contains('cancelBtn')) {
        todo.toggleEditContainer(e.target.parentElement , e.target.parentElement.nextElementSibling);
    }

    // === Check === //
    if (e.target.type === 'checkbox') {
        const checkbox = e.target;
        p = e.target.nextElementSibling.nextElementSibling;
        todo.check(checkbox , p );
    }

});
