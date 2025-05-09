class ToDoList {
    tasks = []
    isUserMovingItem = false
    selectedItem = null
    mouseStartY = 0
    itemStartY = 0

    constructor() {
        this.container = document.getElementById("container")
        this.addModal = document.getElementById("add-modal")

        document.getElementById("add-task").addEventListener("click", () => {
            document.getElementById("confirm-edit-btn").style.display = "none"
            document.getElementById("confirm-addition-btn").style.display = "block"
            this.openModal(this.addModal)
        })
        document.getElementById("add-subtask").addEventListener("click", this.addSubtask.bind(this, null, null))
        document.getElementById("cancel-addition-btn").addEventListener("click", () => this.closeModal(this.addModal))

        document.getElementById("confirm-deletion-btn").addEventListener("click", () => {
            this.tasks.splice(this.tasks.findIndex(e => e == this.selectedItem), 1)
            this.selectedItem.remove()
            this.selectedItem = null

            this.closeModal(document.getElementById("delete-modal"))
        })
        document.getElementById("cancel-deletion-btn").addEventListener("click", () => {this.closeModal(document.getElementById("delete-modal"))})

        this.updateSave()

        this.fetchAll()
    }

    fetchAll() {
        fetch("api").then(response => response.json()).then(json => {
            for(let i = 0; i < json.Data.length; i++) {
                this.createTask(json.Data[i])
            }
            document.addEventListener("mousemove", this.moveItem.bind(this))
            document.addEventListener("mouseup", this.placeItem.bind(this))
        })
    }

    createTask(taskData) {
        const toDoItem = document.createElement("div")
                toDoItem.classList.add("todo-item")
                toDoItem.id = taskData.id
                toDoItem.style.order = document.getElementsByClassName("todo-item").length
                toDoItem.style.height = "30px"
        
                const item = document.createElement("div")
                item.classList.add("item")
                item.addEventListener("click", function(e) {
                    if(!this.isUserMovingItem) {
                        if(e.target.tagName != "INPUT" && e.target.tagName != "LABEL" && e.target.tagName != "IMG") {
                            if(this.parentElement.style.height != parseInt(getComputedStyle(this)["margin"]) * 2 + this.offsetHeight + "px") {
                                this.parentElement.style.height = parseInt(getComputedStyle(this)["margin"]) * 2 + this.offsetHeight + "px"
                                arrow.style.clipPath = "polygon(0 60%, 0 40%, 50% 10%, 100% 40%, 100% 60%, 50% 30%)"
                            }
                            else {
                                this.parentElement.style.height = "fit-content"
                                arrow.style.clipPath = "polygon(0 60%, 0 40%, 50% 70%, 100% 40%, 100% 60%, 50% 90%)"
                            }
                        }
                    }     
                })
        
                const leftPanel = document.createElement("div")
                leftPanel.classList.add("left-panel")
        
                const arrow = document.createElement("div")
                arrow.classList.add("arrow")
        
                const checkbox = document.createElement("input")
                checkbox.type = "checkbox"
                checkbox.checked = taskData.Done
                checkbox.id = `main-${taskData.id}`
        
                const label = document.createElement("label")
                label.setAttribute("for", `main-${taskData.id}`)
                label.textContent = taskData.Name
        
                const rightPanel = document.createElement("div")
                rightPanel.classList.add("right-panel")
        
                const deleteBtn = document.createElement("img")
                deleteBtn.classList.add("icon")
                deleteBtn.src = "gfx/delete.svg"
                deleteBtn.addEventListener("click", () => {
                    this.selectedItem = toDoItem
                    this.openModal(document.getElementById("delete-modal"))
                })
        
                const editBtn = document.createElement("img")
                editBtn.classList.add("icon")
                editBtn.src = "gfx/edit.svg"
                editBtn.addEventListener("click", () => {
                    let data = {
                        name: document.querySelector(`label[for="main-${toDoItem.id}"]`).textContent,
                        done: document.getElementById(`main-${toDoItem.id}`).checked,
                        subtasks: []
                    }
                    const subtasks = document.getElementById(toDoItem.id).children
                    for(let i = 1; i < subtasks.length; i++) {
                        data.subtasks.push({
                            done: subtasks[i].children[0].checked,
                            name: subtasks[i].children[1].textContent
                        })
                    }
                    this.editTask(data)
                })
        
                const moveBtn = document.createElement("img")
                moveBtn.classList.add("icon")
                moveBtn.src = "gfx/move.svg"
                moveBtn.addEventListener("mousedown", (e) => {
                    if(!this.isUserMovingItem) {
                        document.body.style.cursor = "grabbing"
                        moveBtn.style.cursor = "grabbing"

                        this.isUserMovingItem = true
                        this.mouseStartY = e.clientY
                        this.itemStartY = toDoItem.offsetTop
                        this.selectedItem = toDoItem

                        const placeholder = document.createElement("div")
                        placeholder.classList.add("todo-item")
                        placeholder.style.height = toDoItem.clientHeight + "px"
                        placeholder.style.order = toDoItem.style.order
                        placeholder.id = "placeholder"

                        toDoItem.style.width = "calc(50% - 10px)"
                        toDoItem.style.left = `calc(50% - ${toDoItem.clientWidth/2})`
                        toDoItem.style.top = toDoItem.offsetTop + "px"
                        toDoItem.style.position = "absolute"
                        toDoItem.style.zIndex = "1"
                        toDoItem.style.order = ""

                        this.container.appendChild(placeholder)
                    }
                })
        
                toDoItem.style.height = parseInt(getComputedStyle(item)["margin"]) * 2 + item.offsetHeight + "px"
        
                leftPanel.appendChild(arrow)
                leftPanel.appendChild(checkbox)
                leftPanel.appendChild(label)
                item.appendChild(leftPanel)
        
                rightPanel.appendChild(deleteBtn)
                rightPanel.appendChild(editBtn)
                rightPanel.appendChild(moveBtn)
                item.appendChild(rightPanel)
        
                toDoItem.appendChild(item)
        
                if(taskData.Subtasks) {
                    for(let i = 1; i <= taskData.Subtasks.length; i++) {
                        const subtask = document.createElement("div")
                        subtask.classList.add("item")
                        subtask.classList.add("subtask")
                
                        const subcheckbox = document.createElement("input")
                        subcheckbox.type = "checkbox"
                        subcheckbox.checked = taskData.Subtasks[i-1].Done
                        subcheckbox.id = `sub-${i}-${taskData.id}`
                        subcheckbox.tabIndex = -1
                
                        const sublabel = document.createElement("label")
                        sublabel.textContent = taskData.Subtasks[i-1].Name
                        sublabel.setAttribute("for", `sub-${i}-${taskData.id}`)
                        
                        subtask.appendChild(subcheckbox)
                        subtask.appendChild(sublabel)
                        toDoItem.appendChild(subtask)
                    }
                }
                
                this.container.appendChild(toDoItem)

                this.tasks.push(toDoItem)
    }

    moveItem(mouseEvent) {
        if(this.isUserMovingItem) {
            if(this.selectedItem.classList.contains("subtask")) {
                if(this.itemStartY - (this.mouseStartY - mouseEvent.clientY) < 0) this.selectedItem.style.top = 0
                else if(this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + this.selectedItem.clientHeight > this.addModal.clientHeight) this.selectedItem.style.top = this.addModal.clientHeight
                else this.selectedItem.style.top = this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + "px"
            }
            else {
                if(this.itemStartY - (this.mouseStartY - mouseEvent.clientY) < this.container.offsetTop) this.selectedItem.style.top = this.container.offsetTop
                else if(this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + this.selectedItem.clientHeight > this.container.offsetTop + this.container.clientHeight) this.selectedItem.style.top = this.container.offsetTop
                else this.selectedItem.style.top = this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + "px"
            }
        }
    }

    placeItem() {
        if(this.isUserMovingItem) {
            this.isUserMovingItem = false
            document.getElementById("placeholder").remove()


            if(this.selectedItem.classList.contains("subtask")) {
                let subtasks = [...document.querySelectorAll("div#add-modal div.subtask:not(#add-subtask)")]
                subtasks = subtasks.sort((a, b) => a.offsetTop - b.offsetTop)

                for(let i = 0; i < subtasks.length; i++) {
                    subtasks[i].style.order = i+1
                }
            }
            else {
                let tasks = this.tasks
                let newOrder = tasks.sort((a, b) => a.offsetTop - b.offsetTop)

                for(let i = 0; i < newOrder.length; i++) {
                    newOrder[i].style.order = i
                }

                this.tasks = newOrder
                this.selectedItem.children[0].children[1].children[2].style.cursor = "grab"
            }

            this.selectedItem.style.position = "static"
            this.selectedItem.style.zIndex = "0"
            this.selectedItem.style.width = "auto"

            document.body.style.cursor = "auto"
        }
    }

    openModal(modal) {
        document.getElementById("cover").style.display = "block"
        this.container.style.filter = "blur(4px)"
        setTimeout(() => {modal.style.top = "50%"}, 100)
    }

    closeModal(modal) {
        modal.style.top = "-300px"
        this.container.style.filter = "none"
        setTimeout(() => {
            document.getElementById("cover").style.display = "none"
            if(modal.id == "add-modal") {
                const subtasks = document.querySelectorAll("div#add-modal div.subtask:not(#add-subtask)")
                if(subtasks.length > 0) {
                    for(const subtask of subtasks) {
                        subtask.remove()
                    }
                }
                document.getElementById("task-name").value = ""
            }
        }, 1000)
    }

    addSubtask(name, done) {
        const subtask = document.createElement("div")
        subtask.classList.add("item")
        subtask.classList.add("subtask")
        subtask.style.order = document.querySelectorAll("div#add-modal div.subtask:not(#add-subtask)").length+1

        const checkbox = subtask.appendChild(document.createElement("input"))
        checkbox.type = "checkbox"
        checkbox.checked = done
        checkbox.disabled = true

        const input = subtask.appendChild(document.createElement("input"))
        input.classList.add("subtask-name")
        input.type = "text"
        input.placeholder = "Subtask Name"
        if(name) input.value = name

        const delBtn = subtask.appendChild(document.createElement("img"))
        delBtn.src = "gfx/delete.svg"
        delBtn.classList.add("icon")
        delBtn.addEventListener("click", () => {subtask.remove()})

        const moveBtn = subtask.appendChild(document.createElement("img"))
        moveBtn.src = "gfx/move.svg"
        moveBtn.classList.add("icon")
        moveBtn.addEventListener("mousedown", (e) => {
            if(!this.isUserMovingItem) {
                document.body.style.cursor = "grabbing"
                moveBtn.style.cursor = "grabbing"
                this.isUserMovingItem = true
                this.mouseStartY = e.clientY
                this.itemStartY = subtask.offsetTop
                this.selectedItem = subtask
                const placeholder = document.createElement("div")
                placeholder.classList.add("item")
                placeholder.classList.add("subtask")
                placeholder.style.height = subtask.clientHeight + "px"
                placeholder.style.order = subtask.style.order
                placeholder.style.backgroundColor = "var(--dark-gray)"
                placeholder.id = "placeholder"
                subtask.style.width = "calc(100% - 40px)"
                subtask.style.left = `calc(50% - ${subtask.clientWidth/2})`
                subtask.style.top = subtask.offsetTop + "px"
                subtask.style.position = "absolute"
                subtask.style.zIndex = "1"
                subtask.style.order = ""
                document.getElementById("add-panel").appendChild(placeholder)
            }
        })

        document.querySelector("div#add-modal div.todo-item").appendChild(subtask)
    }

    editTask(data) {
        document.getElementById("task-name").value = data.name
        if(data.subtasks.length > 0) {
            for(const subtask of data.subtasks) this.addSubtask(subtask.name, subtask.done)
        }
        document.getElementById("confirm-edit-btn").style.display = "block"
        document.getElementById("confirm-addition-btn").style.display = "none"
        this.openModal(document.getElementById("add-modal"))
    }

    updateSave() {
        document.getElementById("save-hour").textContent = `${new Date().getHours()}`.padStart(2, "0")
        document.getElementById("save-minutes").textContent = `${new Date().getMinutes()}`.padStart(2, "0")
    }
}

export {ToDoList}