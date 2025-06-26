// Save tasks (text + completed status) to localStorage
function saveTasks() {
  const listItems = document.querySelectorAll("#todo-list li");
  const tasks = [];

  listItems.forEach(item => {
    const text = item.querySelector("span").innerText;
    const completed = item.classList.contains("completed");
    tasks.push({ text, completed });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load saved tasks on page load
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    const tasks = JSON.parse(saved);
    tasks.forEach(task => addTask(task.text, task.completed));
  }
}

// Main task creation function
function addTask(taskTextFromStorage, isCompleted = false) {
  const input = document.getElementById("todo-input");
  const taskText = taskTextFromStorage || input.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  if (isCompleted) {
    li.classList.add("completed");
  }

  // Task text element
  const span = document.createElement("span");
  span.innerText = taskText;

  // Toggle completion on click
  span.onclick = function () {
    li.classList.toggle("completed");
    saveTasks();
  };

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.classList.add("edit-btn");

  editBtn.onclick = function () {
    const confirmEdit = confirm("Do you want to edit this task?");
    if (!confirmEdit) return;

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.value = span.innerText;

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.classList.add("save-btn");

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.classList.add("cancel-btn");

    const actionGroup = document.createElement("div");
    actionGroup.classList.add("edit-actions");
    actionGroup.appendChild(saveBtn);
    actionGroup.appendChild(cancelBtn);

    li.replaceChild(newInput, span);
    li.appendChild(actionGroup);
    newInput.focus();

    saveBtn.onclick = function () {
      const newValue = newInput.value.trim();
      if (newValue !== "") {
        span.innerText = newValue;
        alert("Task edited successfully!");
        li.replaceChild(span, newInput);
        if (li.contains(actionGroup)) {
          li.removeChild(actionGroup);
        }
        saveTasks();
      }
    };

    cancelBtn.onclick = function () {
      li.replaceChild(span, newInput);
      if (li.contains(actionGroup)) {
        li.removeChild(actionGroup);
      }
    };
  };

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.classList.add("delete-btn");

  deleteBtn.onclick = function () {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      li.remove();
      saveTasks();
    }
  };

  // Group edit/delete buttons
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  document.getElementById("todo-list").appendChild(li);

  if (!taskTextFromStorage) {
    input.value = "";
  }

  saveTasks();
}

// Load tasks when the page is loaded
window.onload = loadTasks;
