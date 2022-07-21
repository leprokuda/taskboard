const dom = {
  new: document.getElementById('new'),
  addBtn: document.getElementById('add'),
  tasksList: document.getElementById('tasks'),
  countAll: document.getElementById('count-all'),
  content: document.getElementById('content'),
  managementBtns: document.getElementById('management'),
  container: document.getElementById('container'),
  

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

// Длбавление задачи по кнопке Enter

dom.new.addEventListener('keydown', function(ev) {
  
  const newTaskText = dom.new.value
  
  if (ev.key !== 'Enter') {
    return
  }

  if (newTaskText && isNotHaveTask(newTaskText, tasksList)) {

    addTask(newTaskText, tasksList)

    dom.new.value = ''

    tasksListRender(tasksList)
  }
})

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

    renderTasksCountAll(list)
  })

  dom.tasksList.innerHTML = htmlList
}

// Отлсеживаем клики в контейнере для получения списка задач и кнопок управления

dom.container.onclick = (ev) => {

  const target = ev.target
  const managementBtns = target.classList.contains('taskboard__management')
  const doneBtn = target.classList.contains('taskboard__complete-all')
  const deleteBtn = target.classList.contains('taskboard__delete-all')
  const list = target.classList.contains('taskboard__list')
  const task = target.classList.contains('taskboard__task')
  const taskSelected = target.getAttribute('selected')
  const taskId = target.getAttribute('id')

  if (doneBtn) {

    changeSelectedTask(taskSelected, tasksList)



    tasksListRender(tasksList)
  }

  if (deleteBtn) {



    tasksListRender(tasksList)
  }

  localStorage.setItem('taskboard', JSON.stringify(tasksList))
}
// Отслеживаем клики в списке задач

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

// Функция изменения статуса для всех выделенных задач

function changeSelectedTask(selected, list) {
  list.forEach((task) => {
    if (task.selected) {
      task.isComplete = !task.isComplete
      task.selected = false
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

// Удаление выбранных задач
// TODO: Доделать!

function deleteSelectedTask(selected, list) {

  let result = tasksList.filter(function(task) {
    return task.selected !== true
  })
}

// Вывод количества задач

function renderTasksCountAll(list) {
  
  dom.countAll.innerHTML = list.length
  
  if (list.length === undefined) {
    list.length = 0 
  }
}