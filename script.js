const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const searchInput = document.getElementById("searchInput");

window.onload = () => {
  loadTasks();
  loadDarkMode();
};

function addTask() {
  const text = taskInput.value.trim();
  const category = categorySelect().value;
  const priority = prioritySelect().value;
  const dueDate = document.getElementById("dueDate").value;

  if (text === "") return alert("Enter a task!");

  const task = { text, category, priority, dueDate, completed:false };

  saveTask(task);
  displayTask(task);
  taskInput.value = "";
  updateCounter();
}

function displayTask(task) {
  const li = document.createElement("li");
  li.classList.add(task.priority);

  const span = document.createElement("span");
  span.innerHTML = `${task.text}<br>
  <small>${task.category} • ${task.priority} • Due: ${task.dueDate || "none"}</small>`;

  if (task.completed) span.classList.add("completed");

  span.onclick = () => {
    span.classList.toggle("completed");
    updateStorage();
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "✖";
  delBtn.onclick = () => {
    li.remove();
    updateStorage();
    updateCounter();
  };

  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
  sortTasks();
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  getTasks().forEach(task => displayTask(task));
  updateCounter();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    const span = li.querySelector("span");
    const text = span.childNodes[0].nodeValue;
    const completed = span.classList.contains("completed");
    const priority = li.classList[0];
    const parts = span.innerText.split("•");
    const category = parts[0].trim();
    const dueDate = parts[2]?.replace("Due:","").trim();

    tasks.push({ text, category, priority, dueDate, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
  const total = document.querySelectorAll("li:not(.completed)").length;
  counter.textContent = `You have ${total} tasks`;
}

function searchTasks() {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll("li").forEach(li => {
    li.style.display = li.innerText.toLowerCase().includes(filter) ? "" : "none";
  });
}

function filterTasks(cat) {
  document.querySelectorAll("li").forEach(li => {
    li.style.display = (cat==="all" || li.innerText.includes(cat)) ? "" : "none";
  });
}

function clearCompleted() {
  document.querySelectorAll(".completed").forEach(e => e.parentElement.remove());
  updateStorage();
  updateCounter();
}

function sortTasks() {
  const priorities = { high:1, medium:2, low:3 };
  const items = Array.from(taskList.children);
  items.sort((a,b)=>priorities[a.classList[0]]-priorities[b.classList[0]]);
  items.forEach(li=>taskList.appendChild(li));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function loadDarkMode() {
  if(localStorage.getItem("darkMode")==="true"){
    document.body.classList.add("dark");
  }
}

function categorySelect() {
  return document.getElementById("category");
}

function prioritySelect() {
  return document.getElementById("priority");
}