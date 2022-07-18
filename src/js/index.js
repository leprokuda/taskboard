const dom = {
  new: document.getElementById('new'),
  btnAdd: document.getElementById('add'),
  tasksList: document.getElementById('tasks'),
  count: document.getElementById('count')
}

// Массив задач

const tasksList = []

// Отслеживаем клик по кнопке Добавить задачу

dom.btnAdd.onclick = () => {

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
    isComplete: false
  }

  list.push(newTask)
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

    const addClass = newTask.isComplete
    ? 'taskboard__task taskboard__task_complete'
    : 'taskboard__task'

    const isChecked = newTask.isComplete
    ? 'checked'
    : ''

    const taskHtml = `
    <div id="${newTask.id}" class="${addClass}">
      <label class="taskboard__checkbox">
        <input type="checkbox" ${isChecked}>
        <div class="taskboard__checkbox-container"></div>
      </label>
      <div class="taskboard__task-text">${newTask.text}</div>
      <div class="taskboard__task-del">-</div>
    </div>
    `

    htmlList = htmlList + taskHtml

    renderTasksCount(list)
  })

  dom.tasksList.innerHTML = htmlList
}

// Отслеживаем клик по чекбоксу задачи и применяем написанные функции

dom.tasksList.onclick = (ev) => {

  const target = ev.target
  const isCheckboxEl = target.classList.contains('taskboard__checkbox-container')
  const isDeleteEl = target.classList.contains('taskboard__task-del')
  
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