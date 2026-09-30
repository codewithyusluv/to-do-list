const STORAGE_KEY = 'todo-list-items';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearCompleted = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTaskCount() {
  const activeTasks = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${activeTasks} task${activeTasks === 1 ? '' : 's'} left`;
}

function renderTasks() {
  todoList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks yet. Add one above!';
    todoList.appendChild(emptyState);
    updateTaskCount();
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = `todo-item${task.completed ? ' completed' : ''}`;

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.text} as complete`);

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskContent.appendChild(checkbox);
    taskContent.appendChild(text);
    item.appendChild(taskContent);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  });

  updateTaskCount();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: value,
    completed: false,
  });

  input.value = '';
  input.focus();
  saveTasks();
  renderTasks();
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
