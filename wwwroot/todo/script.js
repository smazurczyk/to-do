fetch("api").then(response => response.json()).then(json => {
    console.log(json)
    const container = document.getElementById("container")
    json.Data.forEach(element => {
        const toDoItem = document.createElement("div")
        toDoItem.classList.add("todo-item")
        toDoItem.id = element.id

        const item = document.createElement("div")
        item.classList.add("item") 

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = element.Done

        const label = document.createElement("label")
        label.setAttribute("for", element.id)
        label.textContent = element.Name

        item.appendChild(checkbox)
        item.appendChild(label)
        toDoItem.appendChild(item)
        container.appendChild(toDoItem)

        if(element.Subtasks) {
            element.Subtasks.forEach(e => {
                const subtask = document.createElement("div")
                subtask.classList.add("subtask")

                const subitem = document.createElement("div")
                subitem.classList.add("item") 
        
                const subcheckbox = document.createElement("input")
                subcheckbox.type = "checkbox"
                subcheckbox.checked = e.Done
        
                const sublabel = document.createElement("label")
                sublabel.textContent = e.Name
                
                subitem.appendChild(subcheckbox)
                subitem.appendChild(sublabel)
                subtask.appendChild(subitem)
                toDoItem.appendChild(subtask)
            })
        }
    })
})