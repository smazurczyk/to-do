import { ToDoList } from "./modules/ToDoList.js"

const taskList = new ToDoList()

document.addEventListener("keydown", function(e) {
    if(e.key == "l") console.log(taskList)
})