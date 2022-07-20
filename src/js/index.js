const dom = {
  new: document.getElementById('new'),
  addBtn: document.getElementById('add'),
  tasksList: document.getElementById('tasks'),
  count: document.getElementById('count'),
  content: document.getElementById('content'),
  managementBtns: document.getElementById('management'),

  // Проверка: выбрана ли хоть одна задача

  get someSelected () {
    return tasksList.some(newTask => newTask.selected)
  }
}

// Массив задач

let tasksList = JSON.parse(localStorage.tasksList || "[]")

// Возвращение данных из localstorage на страницу

if(localStorage.getItem('taskboard')) {
  tasksList = JSON.parse(localStorage.getItem('taskboard') || "[]")
  tasksListRender(tasksList)
}

// Отслеживаем клик по кнопке Добавить задачу

dom.addBtn.onclick = () => {

  const newTaskText = dom.new.value

  if (newTaskText && isNotHaveTask(newTaskText, tasksList)) {

    addTask(newTaskText, tasksList)

    dom.new.value = ''

    tasksListRender(tasksList)
  }
}

// Функция добавления задачи

function addTask(text, list) {

  const timeStamp = Date.now()
  const newTask = {
    id: timeStamp,
    text,
    isComplete: false,
    selected: false,    
  }
  
  list.push(newTask)

  localStorage.setItem('taskboard', JSON.stringify(tasksList))
}

// Проверка существования одинаковых задач

function isNotHaveTask(text, list) {

  let isNotHave = true

  list.forEach((newTask) => {
    if (newTask.text === text) {
      alert('Такая задача уже существует!')
      isNotHave = false
    }
  })

  return isNotHave
}

// Функция вывода списка задач (отрисовка)

function tasksListRender(list) {

  let htmlList = ''

  list.forEach((newTask) => {

    const addCompleteClass = newTask.isComplete
    ? 'taskboard__task taskboard__task_complete'
    : 'taskboard__task'

    const isChecked = newTask.isComplete
    ? 'checked'
    : ''

    const addSelectedClass = newTask.selected
    ? 'taskboard__task_selected' || 'taskboard__task taskboard__task_selected'
    : ''

    const someSelected = dom.someSelected
    ? "style='visibility: hidden'"
    : ''

    const taskHtml = `
    <div selected="${newTask.selected}" id="${newTask.id}" class="${addCompleteClass} ${addSelectedClass}">
      <label class="taskboard__checkbox ${someSelected}">
        <input type="checkbox" ${isChecked}>
        <div class="taskboard__checkbox-container" ${someSelected}></div>
      </label>
      <div class="taskboard__task-text">${newTask.text}</div>
      <div class="taskboard__task-del" ${someSelected}></div>
    </div>
    `

    htmlList = htmlList + taskHtml

    renderTasksCount(list)
  })

  dom.tasksList.innerHTML = htmlList
}
// TODO: Удаление выделенных задач
// dom.managementBtns.addEventListener('click', (ev) => {
//   if (ev.target.classList.contains('delete-all')) {

//   }
// })

// Отслеживаем клики

dom.tasksList.onclick = (ev) => {

  const target = ev.target
  const isSelectedText = target.classList.contains('taskboard__task-text')
  const isSelectedTask = target.classList.contains('taskboard__task')
  const isCheckboxEl = target.classList.contains('taskboard__checkbox-container')
  const isDeleteEl = target.classList.contains('taskboard__task-del')

  if (isSelectedText || isSelectedTask) {

    const task = target
    const taskId = task.getAttribute('id')

    selectedTask (taskId, tasksList)

    tasksListRender(tasksList)
  }
  
  if (isCheckboxEl) {

    const task = target.parentElement.parentElement
    const taskId = task.getAttribute('id')

    changeTaskStatus(taskId, tasksList)

    tasksListRender(tasksList)
  }

  if (isDeleteEl) {

    const task = target.parentElement
    const taskId = task.getAttribute('id')

    deleteTask(taskId, tasksList)

    renderTasksCount(count)

    tasksListRender(tasksList)
  }

  localStorage.setItem('taskboard', JSON.stringify(tasksList))
}

// Функция изменения статуса selected

function selectedTask (id, list) {

  list.forEach((task) => {

    if (task.id == id) {
      task.selected = !task.selected
    }
  })
}

// Функция изменения статуса задачи

function changeTaskStatus(id, list) {

  list.forEach((task) => {

    if (task.id == id) {
      task.isComplete = !task.isComplete
    }
  })
}

// Функция удаления задачи

function deleteTask(id, list) {

  list.forEach((task, idx) => {
    if (task.id == id) {
      list.splice(idx, 1)
    }
  })
}

// Вывод количества задач

function renderTasksCount(list) {
  
  dom.count.innerHTML = list.length
  
  if (list.length === undefined) {
    list.length = 0 
  }
}