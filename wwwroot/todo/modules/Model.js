class Model {
    tasks = []

    constructor(view) {
        this.view = view

        document.addEventListener("keydown", (e) => {if(e.key == "m") console.log(this)})
    }

    add(data) {
        this.tasks.push(data)
        this.view.addTask(data)
        this.view.updateSave()
    }

    remove(id) {
        this.tasks = this.tasks.filter(task => task.Id != id)
        this.view.removeTask(id)
        this.view.updateSave()
    }

    getDataById(id) {
        return this.tasks.find(task => task.Id == id)
    }

    replace(id, data) {
        this.tasks[this.tasks.findIndex(task => task.Id == id)] = data
        this.view.replaceTask(id, data)
        this.view.updateSave()
    }

    changeOrder(id, newIndex) {
        const oldIndex = this.tasks.findIndex(task => task.Id == id)
        const task =  this.tasks[oldIndex]
        this.tasks.splice(oldIndex, 1)
        this.tasks.splice(newIndex, 0, task)
        this.view.updateSave()
    }

    getIndexById(id) {
        return this.tasks.findIndex(task => task.Id == id)
    }

    filter(data) {
        return data.map(editedTask => {
            if(editedTask.Subtasks.length > 0) {
                for(let i = 0; i < editedTask.Subtasks.length; i++) {
                    const index = editedTask.Subtasks[i].Id.split("_")[1]
                    if(this.tasks.find(task => task.Id == editedTask.Id).Subtasks[index].Done != editedTask.Subtasks[i].Done)
                        editedTask.Subtasks[i] = {index: index, done: editedTask.Subtasks[i].Done}
					else 
						editedTask.Subtasks.splice(index, 1)
                }
				if(editedTask.Subtasks.length > 0 || this.tasks.find(task => task.Id == editedTask.Id).Done != editedTask.Done) return editedTask
            }
            else {
                if(this.tasks.find(task => task.Id == editedTask.Id).Done != editedTask.Done)  return editedTask
            }
        })
    }

	check(data) {
		data.forEach(element => {
			this.tasks[this.tasks.findIndex(e => e.Id == element.Id)].Done = element.Done
            if(element.Subtasks.length == 1) {
                this.tasks[this.tasks.findIndex(e => e.Id == element.Id)].Subtasks[element.Subtasks[0].Index].Done = element.Subtasks[0].Done
            }
            else if(element.Subtasks.length > 1) {
                for(const subtask of element.Subtasks) {
                    this.tasks[this.tasks.findIndex(e => e.Id == element.Id)].Subtasks[subtask.Index] = subtask.Done
                }
            }
		})
		this.view.updateSave()
	}
}

export {Model}