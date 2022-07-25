const dom = {
  new: document.getElementById('new'),
  addBtn: document.getElementById('add'),
  tasksList: document.getElementById('tasks'),
  countAll: document.getElementById('count-all'),
  content: document.getElementById('content'),
  managementBtns: document.getElementById('management'),
  container: document.getElementById('container'),
  countComplete: document.getElementById('count-complete'),
  filter: document.getElementById('filter'),

  // Проверка: выбрана ли хоть одна задача

  get someSelected () {
    return tasksList.some(newTask => newTask.selected)
  }
}

// Массив задач

let tasksList = []

// Возвращение данных из localstorage на страницу

if (localStorage.getItem('taskboard')) {
  tasksList = JSON.parse(localStorage.getItem('taskboard') || "[]")
  tasksListRender(tasksList)
}

// Отслеживаем клик по кнопке Добавить задачу

dom.addBtn.onclick = () => {

  const newTaskText = dom.new.value

  if (newTaskText && isNotHaveTask(newTaskText, tasksList)) {

    addTask(newTaskText, tasksList)

    dom.new.value = ''

    changeLocalStorage(tasksList)
  }
}

// Длбавление задачи по кнопке Enter

dom.new.addEventListener('keydown', function(ev) {

  if (ev.key !== 'Enter') return;
  
  const newTaskText = dom.new.value

  if (newTaskText && isNotHaveTask(newTaskText, tasksList)) {

    addTask(newTaskText, tasksList)

    dom.new.value = ''
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

  changeLocalStorage(list)
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
    renderTaskCountComplete(list)
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
  }

  if (deleteBtn) {

    deleteSelectedTask(taskSelected, tasksList)
  }
}
// Отслеживаем клики в списке задач

dom.tasksList.onclick = (ev) => {

  const target = ev.target
  const isSelectedTask = target.classList.contains('taskboard__task')
  const isCheckboxEl = target.classList.contains('taskboard__checkbox-container')
  const isDeleteEl = target.classList.contains('taskboard__task-del')

  if (isSelectedTask) {

    const task = target
    const taskId = task.getAttribute('id')

    selectedTask (taskId, tasksList)
  }
  
  if (isCheckboxEl) {

    const task = target.parentElement.parentElement
    const taskId = task.getAttribute('id')

    changeTaskStatus(taskId, tasksList)
  }

  if (isDeleteEl) {

    const task = target.parentElement
    const taskId = task.getAttribute('id')

    deleteTask(taskId, tasksList)
  }
}

// Добавление инпута (для редактирования) по двойному клику на задачу. Редактирование задачи

dom.tasksList.ondblclick = (ev) => {

  const target = ev.target
  const isClickedText = target.classList.contains('taskboard__task-text')
  const taskContainer = target.closest("div[class='taskboard__task ']")
  const taskId = taskContainer.getAttribute("id");

  if (isClickedText) {

    const taskText = target
    let textContent = target.textContent

    textContent = ''

    let editInput = document.createElement('input')
    editInput.value = textContent
    
    target.appendChild(editInput)

    editInput.addEventListener('keypress', function(ev) {

      if (ev.key == 'Enter') {
        taskText.textContent = editInput.value;
        console.log(taskId)
        changeTaskText(taskId, tasksList, editInput.value)
      }
    })
  }
}

function changeTaskText(taskId, list, text) {
  const task = list.find(taskEl => taskEl.id.toString() === taskId);
  task.text = text;
  changeLocalStorage(list)
}

// Фильтрация задач

dom.filter.onchange = (ev) => {

  const value = ev.target.value

  const filteredTasks = tasksList.filter(task => {
    const reg = new RegExp(value)

    if (reg.test(task.isComplete)) {
      return true
    } else {
      return false
    }
  })
  tasksListRender(filteredTasks, tasksList)
}

// Функция изменения статуса selected

function selectedTask (id, list) {

  list.forEach((task) => {

    if (task.id == id) {
      task.selected = !task.selected
    }
  })
  changeLocalStorage(list)
}

// Функция изменения статуса задачи

function changeTaskStatus(id, list) {

  list.forEach((task) => {

    if (task.id == id) {
      task.isComplete = !task.isComplete
    }
  })
  changeLocalStorage(list)
}

// Функция изменения статуса для всех выделенных задач

function changeSelectedTask(selected, list) {
  list.forEach((task) => {
    if (task.selected) {
      task.isComplete = !task.isComplete
      task.selected = false
    }
  })
  changeLocalStorage(list)
}

// Функция удаления задачи

function deleteTask(id, list) {

  list.forEach((task, idx) => {
    if (task.id == id) {
      list.splice(idx, 1)
    }
  })
  changeLocalStorage(list)
}

// Удаление выбранных задач

function deleteSelectedTask(selected, list) {

  const filteredTasks = list.filter(task => !task.selected)

  changeLocalStorage(filteredTasks)
}

// Вывод общего количества задач

function renderTasksCountAll(list) {
  
  dom.countAll.innerHTML = list.length

  if (list.length === undefined) {
    list.length = 0 
  }
}

// Вывод выполненных здач

function renderTaskCountComplete(tasksList) {

  let countC = 0
  
  tasksList.forEach((task) => {
    if(task.isComplete) {
      countC++
    }
  })
  dom.countComplete.innerHTML = countC
}

// Функция обновления localStorage

function changeLocalStorage(newList) {

  localStorage.clear()
  localStorage.setItem('taskboard', JSON.stringify(newList))
  
  tasksList = newList

  tasksListRender(newList, tasksList)
}