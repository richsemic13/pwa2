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
        this.btn.onclick = () => this.add();
        this.input.addEventListener("keypress", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.add();
            }
        });
        this.render();
    }

    saveToStorage() {
        localStorage.setItem("todos", JSON.stringify(this.todos));
    }

    add() {
        const text = this.input.value.trim();
        if (!text) return alert("Please enter a task.");

        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.unshift(todo);
        this.input.value = "";
        this.saveToStorage();
        this.render();
    }

    del(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
    }

    toggle(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        todo.completed = !todo.completed;
        this.saveToStorage();
        this.render();
    }

    edit(id) {
        this.editId = id;
        this.render();
    }

    saveEdit(id) {
        const ta = document.getElementById(`edit-${id}`);
        const text = ta?.value.trim();
        if (!text) return;

        const todo = this.todos.find(t => t.id === id);
        if (todo) todo.text = text;

        this.editId = null;
        this.saveToStorage();
        this.render();
    }

    escape(s) {
        const d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    render() {
        const rows = this.todos.map((t, idx) => {
            if (this.editId === t.id) {
                return `
                <tr>
                    <td>${idx + 1}</td>
                    <td></td>
                    <td>
                        <textarea id="edit-${t.id}" class="form-control">${this.escape(t.text)}</textarea>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="app.saveEdit(${t.id})">Save</button>
                        <button class="btn btn-sm btn-secondary" onclick="app.editId=null;app.render()">Cancel</button>
                    </td>
                </tr>`;
            }

            return `
            <tr>
                <td>${idx + 1}</td>
                <td><input type="checkbox" ${t.completed ? "checked" : ""} onclick="app.toggle(${t.id})"></td>
                <td class="${t.completed ? "text-decoration-line-through text-muted" : ""}">
                    ${this.escape(t.text)}
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="app.edit(${t.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="app.del(${t.id})">X</button>
                </td>
            </tr>`;
        }).join("") || `<tr><td colspan="4" class="text-center text-muted">No tasks yet</td></tr>`;

        this.list.innerHTML = rows;
        this.count.textContent = this.todos.length;
    }
}

let app;
document.addEventListener("DOMContentLoaded", () => {
    app = new TodoApp();

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
    }
});
