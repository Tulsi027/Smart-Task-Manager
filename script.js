const taskForm  = document.getElementById('taskForm');
const taskList  = document.getElementById('taskList');
const toastElm  = document.getElementById('toast');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const title    = document.getElementById('title').value.trim();
  const dueDate  = document.getElementById('dueDate').value;
  const dueTime  = document.getElementById('dueTime').value;
  const priority = document.getElementById('priority').value;
  if (!title) return;

  const task = { id: Date.now(), title, dueDate, dueTime, priority, completed: false };
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  renderTasks();
});

function showToast(msg){
  toastElm.textContent = msg;
  toastElm.classList.add('show');
  setTimeout(()=> toastElm.classList.remove('show'), 2500);
}

function renderTasks(){
  taskList.innerHTML = '';
  tasks.sort((a,b)=> new Date(a.dueDate+' '+a.dueTime)-new Date(b.dueDate+' '+b.dueTime));
  tasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.className = `task ${task.priority} ${task.completed?'completed':''}`;
    const dueDateTime = new Date(task.dueDate+'T'+task.dueTime);
    const timeDiff = Math.floor((dueDateTime - new Date())/60000);
    const timeLeft = timeDiff>0?`⏳ Due in ${timeDiff} min`:'⚠️ Overdue';

    taskEl.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong><br/>
        <small>${task.dueDate} ${task.dueTime} | Priority: ${task.priority} | ${timeLeft}</small>
      </div>
      <div class="actions">
        <button class="complete-btn">${task.completed?'Undo':'Done'}</button>
        <button class="delete-btn">Delete</button>
      </div>`;

    taskEl.querySelector('.complete-btn').addEventListener('click', ()=>{
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      if(task.completed){ showToast('🎉 Well done! You completed a task.'); }
    });

    taskEl.querySelector('.delete-btn').addEventListener('click', ()=>{
      tasks = tasks.filter(t=> t.id!==task.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(taskEl);
  });
}
