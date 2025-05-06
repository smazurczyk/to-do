fetch("api").then(response => response.json()).then(json => {
    console.log(json)
    const container = document.getElementById("container")
    json.Data.forEach(element => {
        const leftPanel = document.createElement("div")
        leftPanel.classList.add("left-panel")

        const toDoItem = document.createElement("div")
        toDoItem.classList.add("todo-item")
        toDoItem.id = element.id

        const item = document.createElement("div")
        item.classList.add("item")

        const arrow = document.createElement("div")
        arrow.classList.add("arrow")

        item.addEventListener("click", function(e) {
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
        })

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = element.Done
        checkbox.id = `main-${element.id}`

        const label = document.createElement("label")
        label.setAttribute("for", `main-${element.id}`)
        label.textContent = element.Name

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

        leftPanel.appendChild(arrow)
        leftPanel.appendChild(checkbox)
        leftPanel.appendChild(label)
        item.appendChild(leftPanel)

        rightPanel.appendChild(deleteBtn)
        rightPanel.appendChild(editBtn)
        rightPanel.appendChild(moveBtn)
        item.appendChild(rightPanel)

        toDoItem.appendChild(item)
        container.appendChild(toDoItem)

        toDoItem.style.height = parseInt(getComputedStyle(item)["margin"]) * 2 + item.offsetHeight + "px"

        if(element.Subtasks) {
            for(let i = 1; i <= element.Subtasks.length; i++) {
                const subtask = document.createElement("div")
                subtask.classList.add("item")
                subtask.classList.add("subtask")
        
                const subcheckbox = document.createElement("input")
                subcheckbox.type = "checkbox"
                subcheckbox.checked = element.Subtasks[i-1].Done
                subcheckbox.id = `sub-${i}-${element.id}`
        
                const sublabel = document.createElement("label")
                sublabel.textContent = element.Subtasks[i-1].Name
                sublabel.setAttribute("for", `sub-${i}-${element.id}`)
                
                subtask.appendChild(subcheckbox)
                subtask.appendChild(sublabel)
                toDoItem.appendChild(subtask)
            }
        }
    })
})