var taskCounter = 0;

var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#task-completed");
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();

  //pull form values
  var taskNameInput = document.querySelector("input[name='name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // validate task info
  if (!taskNameInput || !taskTypeInput) {
    alert("You must complete task form before submiting");
    return false;
  }

  var isEdit = formEl.hasAttribute("data-task-id");

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };

    createTaskEl(taskDataObj);
  }
  formEl.reset();
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find matching task id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  //change text content
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  //loop through task arrays and task objects with new content
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  // save to localstorage
  saveTasks();

  alert("tasks updated");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function (taskDataObj) {
  // create list El
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // assign task ID
  listItemEl.setAttribute("data-task-id", taskCounter);

  //create div to hold info
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";

  // add html content to div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";

  // append info to list
  listItemEl.appendChild(taskInfoEl);

  // append actions
  var taskActionsEl = createTaskActions(taskCounter);
  listItemEl.appendChild(taskActionsEl);

  //append list to body
  tasksToDoEl.appendChild(listItemEl);

  // save =task id to array
  taskDataObj.id = taskCounter;
  tasks.push(taskDataObj);

  // save arr to localstorage
  saveTasks();

  // increase task counter
  taskCounter++;
};

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // edit button
  var editBtn = document.createElement("button");
  editBtn.className = "btn edit-btn";
  editBtn.textContent = "Edit";
  editBtn.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editBtn);

  //delete button
  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteBtn);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (i = 0; i < statusChoices.length; i++) {
    //create option El's
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

var taskbuttonHandler = function (event) {
  var targetEl = event.target;

  // delete button clicked
  if (event.target.matches(".delete-btn")) {
    // get task id
    var taskId = targetEl.getAttribute("data-task-id");
    // call delete function with id argument
    deleteTask(taskId);
  }

  // edit button clicked
  if (event.target.matches(".edit-btn")) {
    //get task id
    var taskId = targetEl.getAttribute("data-task-id");
    // call edit function with id argument
    editTask(taskId);
  }
};

var editTask = function (taskId) {
  // get task
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get task content
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  // recall task content to input
  document.querySelector("input[name='name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // change add task button to save button
  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  var updatedTaskArr = [];

  for (var i = 0; i < taskCounter.length; i++) {
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  saveTasks();
};

var taskStatusChangeHandler = function (event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update status in array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskbuttonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);
