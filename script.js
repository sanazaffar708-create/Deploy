
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");
const taskLabel = document.getElementById("taskLabel");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("taskflow-tasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.id === "number" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    remainingTasks.textContent = tasks.length - completed;

    taskLabel.textContent =
        `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
}

function renderTasks() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchTerm)
    );

    taskList.replaceChildren();

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as complete");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, text, deleteButton);
        taskList.appendChild(li);
    });

    emptyMessage.hidden = filteredTasks.length > 0;

    if (tasks.length > 0 && filteredTasks.length === 0) {
        emptyMessage.textContent = "🔎 No matching tasks found.";
    } else {
        emptyMessage.textContent = "✨ No tasks yet. Add your first task!";
    }

    updateStats();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    taskInput.value = "";
    searchInput.value = "";
    renderTasks();
    taskInput.focus();
});

searchInput.addEventListener("input", renderTasks);

renderTasks();
