class TodoApp {
    constructor() {
        this.input = document.getElementById("todoInput");
        this.btn = document.getElementById("addBtn");
        this.list = document.getElementById("todoList");
        this.count = document.getElementById("todoCount");

        this.todos = JSON.parse(localStorage.getItem("todos")) || [];
        this.editId = null;

        this.init();
    }

    init() {
        this.btn.addEventListener("click", () => this.add());

        this.input.addEventListener("keypress", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.add();
            }
        });

        this.render();
    }

    save() {
        localStorage.setItem("todos", JSON.stringify(this.todos));
    }

    add() {
        const text = this.input.value.trim();
        if (!text) return;

        this.todos.unshift({
            id: Date.now(),
            text,
            completed: false
        });

        this.input.value = "";
        this.save();
        this.render();
    }

    delete(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }

    toggle(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        todo.completed = !todo.completed;
        this.save();
        this.render();
    }

    edit(id) {
        this.editId = id;
        this.render();
    }

    saveEdit(id) {
        const input = document.getElementById(`edit-${id}`);
        if (!input.value.trim()) return;

        const todo = this.todos.find(t => t.id === id);
        if (todo) todo.text = input.value.trim();

        this.editId = null;
        this.save();
        this.render();
    }

    render() {
        if (this.todos.length === 0) {
            this.list.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted p-4">
                        No tasks yet
                    </td>
                </tr>`;
            this.count.textContent = 0;
            return;
        }

        this.list.innerHTML = this.todos.map((t, i) => {
            if (this.editId === t.id) {
                return `
                <tr>
                    <td>${i + 1}</td>
                    <td></td>
                    <td>
                        <textarea id="edit-${t.id}" class="form-control">${t.text}</textarea>
                    </td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="app.saveEdit(${t.id})">Save</button>
                        <button class="btn btn-secondary btn-sm" onclick="app.editId=null;app.render()">Cancel</button>
                    </td>
                </tr>`;
            }

            return `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <input type="checkbox" ${t.completed ? "checked" : ""} 
                        onclick="app.toggle(${t.id})">
                </td>
                <td class="${t.completed ? "text-decoration-line-through text-muted" : ""}">
                    ${t.text}
                </td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="app.edit(${t.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="app.delete(${t.id})">X</button>
                </td>
            </tr>`;
        }).join("");

        this.count.textContent = this.todos.length;
    }
}

let app;
document.addEventListener("DOMContentLoaded", () => {
    app = new TodoApp();
});
