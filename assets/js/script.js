var tasksToDoEl = document.querySelector("#tasks-to-do");
var formEl = document.querySelector("#task-form");

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

  //append list to body
  tasksToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", taskFormHandler);
