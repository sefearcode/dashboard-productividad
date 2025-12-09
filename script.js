// --- Persistencia del tema ---
const body = document.body;
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") body.classList.add("dark");

document.getElementById("toggle-theme").addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});

// --- Gestión de tareas ---
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((t, i) => {
    const el = document.createElement("div");
    el.className = "task";
    el.innerHTML = `
      <span>${t.title} — <strong>${t.priority}</strong> — ${t.date || "Sin fecha"}</span>
      <button data-index="${i}" class="complete-btn">✔</button>
    `;
    taskList.appendChild(el);
  });
}

renderTasks();
updateStats();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value;
  const priority = document.getElementById("task-priority").value;
  const date = document.getElementById("task-date").value;

  tasks.push({ title, priority, date, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
  renderTasks();
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("complete-btn")) {
    const index = e.target.dataset.index;
    tasks[index].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateStats();
    renderTasks();
  }
});

// --- Estadísticas ---
function updateStats() {
  const completed = tasks.filter(t => t.completed).length;
  document.getElementById("stats-completed").textContent = completed;
}

// --- Pomodoro ---
let pomodoroTime = 25 * 60;
let interval = null;
let pomodoros = parseInt(localStorage.getItem("pomodoros") || 0);

document.getElementById("stats-pomodoros").textContent = pomodoros;

function updatePomodoroDisplay() {
  const m = String(Math.floor(pomodoroTime / 60)).padStart(2, "0");
  const s = String(pomodoroTime % 60).padStart(2, "0");
  document.getElementById("pomodoro-display").textContent = `${m}:${s}`;
}

updatePomodoroDisplay();

function startPomodoro() {
  if (interval) return;
  interval = setInterval(() => {
    pomodoroTime--;
    updatePomodoroDisplay();

    if (pomodoroTime <= 0) {
      clearInterval(interval);
      interval = null;
      pomodoros++;
      localStorage.setItem("pomodoros", pomodoros);
      document.getElementById("stats-pomodoros").textContent = pomodoros;
      alert("Pomodoro completado!");
      pomodoroTime = 25 * 60;
      updatePomodoroDisplay();
    }
  }, 1000);
}

document.getElementById("start-pomodoro").addEventListener("click", startPomodoro);
document.getElementById("stop-pomodoro").addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
});

document.getElementById("reset-pomodoro").addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  pomodoroTime = 25 * 60;
  updatePomodoroDisplay();
});
