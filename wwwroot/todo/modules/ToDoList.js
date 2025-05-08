class ToDoList {
    tasks = []
    isUserMovingItem = false
    movingItem = null
    mouseStartY = 0
    itemStartY = 0

    constructor() {
        this.container = document.body.appendChild(document.createElement("div"))
        this.container.id = "container"

        const header = this.container.appendChild(document.createElement("h1"))
        header.textContent = "To-Do List"

        this.fetchAll()
    }

    fetchAll() {
        fetch("api").then(response => response.json()).then(json => {
            for(let j = 0; j < json.Data.length; j++) {
                const toDoItem = document.createElement("div")
                toDoItem.classList.add("todo-item")
                toDoItem.id = json.Data[j].id
                toDoItem.style.order = j
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
                checkbox.checked = json.Data[j].Done
                checkbox.id = `main-${json.Data[j].id}`
        
                const label = document.createElement("label")
                label.setAttribute("for", `main-${json.Data[j].id}`)
                label.textContent = json.Data[j].Name
        
                const rightPanel = document.createElement("div")
                rightPanel.classList.add("right-panel")
        
                const deleteBtn = document.createElement("img")
                deleteBtn.classList.add("icon")
                deleteBtn.src = "gfx/delete.svg"
        
                const editBtn = document.createElement("img")
                editBtn.classList.add("icon")
                editBtn.src = "gfx/edit.svg"
        
                const moveBtn = document.createElement("img")
                moveBtn.classList.add("icon")
                moveBtn.src = "gfx/move.svg"
                moveBtn.addEventListener("mousedown", this.startMoving.bind(this))
        
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
        
                if(json.Data[j].Subtasks) {
                    for(let i = 1; i <= json.Data[j].Subtasks.length; i++) {
                        const subtask = document.createElement("div")
                        subtask.classList.add("item")
                        subtask.classList.add("subtask")
                
                        const subcheckbox = document.createElement("input")
                        subcheckbox.type = "checkbox"
                        subcheckbox.checked = json.Data[j].Subtasks[i-1].Done
                        subcheckbox.id = `sub-${i}-${json.Data[j].id}`
                        subcheckbox.tabIndex = -1
                
                        const sublabel = document.createElement("label")
                        sublabel.textContent = json.Data[j].Subtasks[i-1].Name
                        sublabel.setAttribute("for", `sub-${i}-${json.Data[j].id}`)
                        
                        subtask.appendChild(subcheckbox)
                        subtask.appendChild(sublabel)
                        toDoItem.appendChild(subtask)
                    }
                }
                
                this.container.appendChild(toDoItem)

                this.tasks.push(toDoItem)
            }
            document.addEventListener("mousemove", this.moveItem.bind(this))
            document.addEventListener("mouseup", this.placeItem.bind(this))
        })
    }

    startMoving() {
        if(!this.isUserMovingItem) {
            document.body.style.cursor = "grabbing"
            moveBtn.style.cursor = "grabbing"

            this.isUserMovingItem = true
            this.mouseStartY = e.clientY
            this.itemStartY = toDoItem.offsetTop
            this.movingItem = toDoItem

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
    }

    moveItem(mouseEvent) {
        if(this.isUserMovingItem) {
            if(this.itemStartY - (this.mouseStartY - mouseEvent.clientY) < this.container.offsetTop) this.movingItem.style.top = this.container.offsetTop
            else if(this.itemStartY - (this.mouseStartY - mouseEvent.clientY) > this.container.offsetTop + this.container.clientHeight) this.movingItem.style.top = this.container.offsetTop + this.container.clientHeight
            else this.movingItem.style.top = this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + "px"
        }
    }

    placeItem() {
        if(this.isUserMovingItem) {
            this.isUserMovingItem = false
            const placeholder = document.getElementById("placeholder")
            let tasks = [...this.tasks, placeholder]

            let newOrder = tasks.sort((a, b) => a.offsetTop - b.offsetTop)
            placeholder.remove()
            newOrder.splice(newOrder.findIndex(e => e == placeholder), 1)

            for(let i = 0; i < newOrder.length; i++) {
                newOrder[i].style.order = i
            }

            this.tasks = newOrder
            this.movingItem.style.position = "static"
            this.movingItem.style.zIndex = "0"
            this.movingItem.style.width = "auto"

            document.body.style.cursor = "auto"
            this.movingItem.children[0].children[1].children[2].style.cursor = "grab"
        }
    }
}

export {ToDoList}