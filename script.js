document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const categoryInput = document.getElementById('categoryInput');
    
    if (taskInput.value.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    const dueDate = formatDate(dueDateInput.value);
    if (!dueDate) {
        alert('Please select a valid future date.');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDay();
    const currentMonth = new Date().getMonth();
    const dueYear = new Date(dueDateInput.value).getFullYear();
    const dueDay = new Date(dueDateInput.value).getDay();
    const dueMonth = new Date(dueDateInput.value).getMonth();
    
    if (dueYear < currentYear) {
        alert(`Due Year must be in ${currentYear} or later.`);
        return;
    }
        else if (dueDay < currentDay) {
            alert(`Due Day must be on ${currentDay} or later.`);
            return;
        }
        else if (dueMonth < currentMonth) {
            alert(`Due Month must be in ${currentMonth} or later.`);
            return;
        }
    
    const task = {
        text: taskInput.value,
        priority: priorityInput.value,
        dueDate: dueDate,
        category: categoryInput.value,
        completed: false
    };
    
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    taskInput.value = '';
    priorityInput.value = 'low';
    dueDateInput.value = '';
    categoryInput.value = 'work';
    
    renderTasks();
}

function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}


function loadTasks() {
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add(`priority-${task.priority}`);
        if (task.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
        <span>${task.text} (Due: ${task.dueDate}) - ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
        <div class="actions">
            <button onclick="toggleComplete(${index})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="removeTask(${index})">Remove</button>
        </div>
    `;
    
        
        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks[index];
    
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const categoryInput = document.getElementById('categoryInput');
    
    taskInput.value = task.text;
    priorityInput.value = task.priority;
    dueDateInput.value = task.dueDate.split('/').reverse().join('-');
    categoryInput.value = task.category;
    
    removeTask(index);
}

function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('toggle-theme').textContent = isDark ? '☀️' : '🌕';
}

document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark');
        document.getElementById('toggle-theme').textContent = darkMode ? '☀️' : '🌕';
    }
    loadTasks();
});
