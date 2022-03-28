var taskCounter = 0;

var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");

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

  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
  };

  createTaskEl(taskDataObj);

  formEl.reset();
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
  console.log(event.target);

  if (event.target.matches(".delete-btn")) {
    // get task id
    var taskId = event.target.getAttribute("data-task-id");
    // call delete function with id argument
    deleteTask(taskId);
  }
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();
};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskbuttonHandler);
