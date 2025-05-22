import { Controller } from "./Controller.js"

/*
	to-do:
		- implement scroll on modal
		- make the site responsive
		- fix styles
		- optimise some methods (View.placeItem, Model.remove)
*/

class View {
	isUserMovingItem = false
	mouseStartY = 0
	itemStartY = 0
	selectedItem = null
	changed = []

	constructor() {
		this.controller = new Controller(this)
		this.container = document.getElementById("container")
		document.addEventListener("mousemove", this.moveItem.bind(this))
		document.addEventListener("mouseup", this.placeItem.bind(this))

		document.getElementById("add-task").addEventListener("click", this.openModal.bind(this, "add"))

		this.controller.getAllTasks()
		this.updateSave()
	}

	displayError(error) {
		console.log(error)
	}

	createTask(data) {
		const toDoItem = document.createElement("div")
		toDoItem.classList.add("todo-item")
		toDoItem.id = data.Id
		toDoItem.style.order = document.querySelectorAll("#container .todo-item:not(.add-btn)").length
		toDoItem.style.height = parseInt(getComputedStyle(document.querySelector(".item")).height) + "px"

		const item = document.createElement("div")
		item.classList.add("item")
		item.addEventListener("click", function (e) {
			if (!this.isUserMovingItem) {
				if (e.target.tagName != "INPUT" && e.target.tagName != "LABEL" && e.target.tagName != "IMG") {
					if (this.parentElement.style.height == "fit-content") {
						this.parentElement.style.height = parseInt(getComputedStyle(this).margin) * 2 + this.offsetHeight + "px"
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
		checkbox.checked = data.Done
		checkbox.id = `main-${data.Id}`
		
		const label = document.createElement("label")
		label.setAttribute("for", `main-${data.Id}`)
		label.textContent = data.Name
		
		this.processChange = this.debounce(() => {this.saveInput()});
		checkbox.addEventListener("input", () => {
			const taskId = this.changed.findIndex(task => task.Id == data.Id)
			if(taskId >= 0) {
				this.changed[taskId].Done = checkbox.checked
			}
			else {
				this.changed.push({Id: data.Id, Done: checkbox.checked, Subtasks: []})
			}
			this.processChange()
		})

		const rightPanel = document.createElement("div")
		rightPanel.classList.add("right-panel")

		const deleteBtn = document.createElement("img")
		deleteBtn.classList.add("icon")
		deleteBtn.src = "gfx/delete.svg"
		deleteBtn.addEventListener("click", this.openModal.bind(this, "remove", data.Id))

		const editBtn = document.createElement("img")
		editBtn.classList.add("icon")
		editBtn.src = "gfx/edit.svg"
		editBtn.addEventListener("click", this.openModal.bind(this, "edit", data.Id))

		const moveBtn = document.createElement("img")
		moveBtn.classList.add("icon")
		moveBtn.src = "gfx/move.svg"
		moveBtn.addEventListener("mousedown", (e) => {
			if (!this.isUserMovingItem) {
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
				toDoItem.style.left = `calc(50% - ${toDoItem.clientWidth / 2})`
				toDoItem.style.top = toDoItem.offsetTop + "px"
				toDoItem.style.position = "absolute"
				toDoItem.style.zIndex = "1"
				toDoItem.style.order = ""

				this.container.appendChild(placeholder)
			}
		})

		leftPanel.appendChild(arrow)
		leftPanel.appendChild(checkbox)
		leftPanel.appendChild(label)
		item.appendChild(leftPanel)

		rightPanel.appendChild(deleteBtn)
		rightPanel.appendChild(editBtn)
		rightPanel.appendChild(moveBtn)
		item.appendChild(rightPanel)

		toDoItem.appendChild(item)

		if (data.Subtasks) {
			for (let i = 0; i < data.Subtasks.length; i++) {
				const subtask = document.createElement("div")
				subtask.classList.add("item")
				subtask.classList.add("subtask")

				const subcheckbox = document.createElement("input")
				subcheckbox.type = "checkbox"
				subcheckbox.checked = data.Subtasks[i].Done
				subcheckbox.id = `sub_${i}_${data.Id}`
				// disabling focusing subcheckboxes using Tab
				subcheckbox.tabIndex = -1

				const sublabel = document.createElement("label")
				sublabel.textContent = data.Subtasks[i].Name
				sublabel.setAttribute("for", `sub_${i}_${data.Id}`)

				subcheckbox.addEventListener("input", () => {
					const taskId = this.changed.findIndex(task => task.Id == data.Id)
					if(taskId >= 0) {
						const subtaskId = this.changed[taskId].Subtasks.findIndex(subtask => subtask.Id == subcheckbox.id)
						if(subtaskId >= 0) {
							this.changed[taskId].Subtasks[subtaskId].Done = subcheckbox.checked
						}
						else {
							this.changed[taskId].Subtasks.push({Id: subcheckbox.id, Done: subcheckbox.checked})
						}
					}
					else {
						this.changed.push({Id: data.Id, Done: checkbox.checked, Subtasks: [{Id: subcheckbox.id, Done: subcheckbox.checked}]})
					}
					this.processChange()
				})

				subtask.appendChild(subcheckbox)
				subtask.appendChild(sublabel)
				toDoItem.appendChild(subtask)
			}
		}

		return toDoItem
	}

	addTask(data) {
		const toDoItem = this.createTask(data)
		this.container.appendChild(toDoItem)
	}

	replaceTask(id, data) {
		const toDoItem = this.createTask(data)
		toDoItem.style.order = document.getElementById(id).style.order
		toDoItem.style.height = "fit-content"
		document.getElementById(id).replaceWith(toDoItem)
	}

	removeTask(id) {
		document.getElementById(id).remove()
	}

	updateSave() {
		document.getElementById("save-hour").textContent = `${new Date().getHours()}`.padStart(2, "0")
		document.getElementById("save-minutes").textContent = `${new Date().getMinutes()}`.padStart(2, "0")
	}

	openModal(type, id) {
		const cover = document.createElement("div")
		cover.setAttribute("id", "cover")

		const modal = document.createElement("div")
		this.modal = modal
		modal.classList.add("modal")

		const btnContainer = document.createElement("div")
		btnContainer.classList.add("button-container")

		const confirmBtn = document.createElement("button")
		confirmBtn.textContent = "Confirm"
		btnContainer.appendChild(confirmBtn)

		const cancelBtn = document.createElement("button")
		cancelBtn.textContent = "Cancel"
		cancelBtn.addEventListener("click", this.closeModal.bind(this, modal))
		btnContainer.appendChild(cancelBtn)

		if (type == "add" || type == "edit") {
			const addPanel = document.createElement("div")
			addPanel.classList.add("todo-item")

			const nameContainer = document.createElement("div")
			nameContainer.classList.add("item")

			const taskName = document.createElement("input")
			taskName.type = "text"
			taskName.placeholder = "Task Name"
			taskName.id = "task-name"
			taskName.style.order = 0
			nameContainer.appendChild(taskName)
			addPanel.appendChild(nameContainer)

			const addSubtaskBtn = document.createElement("div")
			addSubtaskBtn.classList.add("item", "subtask", "add-btn")
			addSubtaskBtn.style.order = 99999
			addSubtaskBtn.addEventListener("click", this.addSubtask.bind(this, addPanel, null))

			const addIcon = document.createElement("img")
			addIcon.src = "gfx/add.svg"
			addIcon.classList.add("add-icon")
			addSubtaskBtn.appendChild(addIcon)

			const addSubtaskText = document.createElement("p")
			addSubtaskText.textContent = "Add subtask"
			addSubtaskBtn.appendChild(addSubtaskText)
			addPanel.appendChild(addSubtaskBtn)

			if (type == "edit") {
				const data = this.controller.getDataById(id)
				taskName.value = data.Name
				for (const subtask of data.Subtasks) { this.addSubtask(addPanel, subtask) }
			}

			modal.appendChild(addPanel)

			confirmBtn.addEventListener("click", () => {
				if (taskName.value) {
					let data = {
						Name: "",
						Done: false,
						Subtasks: []
					}

					data.Name = taskName.value
					if(type == "edit") data.Done = document.getElementById(`main-${id}`).checked
					for (const subtask of [...addPanel.children].slice(2).sort((a, b) => a.style.order - b.style.order)) {
						let subtaskName = subtask.children[1].value
						if (subtaskName) data.Subtasks.push({ Name: subtaskName })
					}

					if (type == "add") this.controller.add(data).then(this.closeModal.bind(this, modal))
					else this.controller.replace(id, data).then(this.closeModal.bind(this, modal))
				}
			})
		}
		else if (type == "remove") {
			const heading = document.createElement("h3")
			heading.textContent = "Are you sure you want to delete this task?"

			confirmBtn.addEventListener("click", () => {
				this.controller.remove(id).then(this.closeModal.bind(this, modal))
			})

			modal.appendChild(heading)
		}
		modal.appendChild(btnContainer)

		cover.appendChild(modal)
		document.body.appendChild(cover)
		requestAnimationFrame(() => { modal.style.top = "50%" })
		this.container.style.filter = "blur(4px)"
	}

	closeModal(modal) {
		modal.style.top = -modal.clientHeight + "px"
		this.container.style.filter = "none"
		setTimeout(() => {
			modal.parentElement.remove()
		}, 1500)
	}

	addSubtask(addPanel, data) {
		const subtask = document.createElement("div")
		subtask.classList.add("item")
		subtask.classList.add("subtask")
		subtask.style.order = addPanel.children.length - 1
		const checkbox = subtask.appendChild(document.createElement("input"))
		checkbox.type = "checkbox"
		if (data) checkbox.checked = data.Done
		checkbox.disabled = true
		const input = subtask.appendChild(document.createElement("input"))
		input.classList.add("subtask-name")
		input.type = "text"
		input.placeholder = "Subtask Name"
		if (data) input.value = data.Name
		const delBtn = subtask.appendChild(document.createElement("img"))
		delBtn.src = "gfx/delete.svg"
		delBtn.classList.add("icon")
		delBtn.addEventListener("click", () => {
			subtask.remove()
		})
		const moveBtn = subtask.appendChild(document.createElement("img"))
		moveBtn.src = "gfx/move.svg"
		moveBtn.classList.add("icon")
		moveBtn.addEventListener("mousedown", (e) => {
			if (!this.isUserMovingItem) {
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
				subtask.style.left = `calc(50% - ${subtask.clientWidth / 2})`
				subtask.style.top = subtask.offsetTop + "px"
				subtask.style.position = "absolute"
				subtask.style.zIndex = "1"
				subtask.style.order = ""
				addPanel.appendChild(placeholder)
			}
		})
		addPanel.appendChild(subtask)
	}

	moveItem(mouseEvent) {
		if (this.isUserMovingItem) {
			if (this.selectedItem.classList.contains("subtask")) {
				if (this.itemStartY - (this.mouseStartY - mouseEvent.clientY) < 0) this.selectedItem.style.top = 0
				else if (this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + this.selectedItem.clientHeight > this.modal.clientHeight) this.selectedItem.style.top = this.modal.clientHeight
				else this.selectedItem.style.top = this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + "px"
			}
			else {
				if (this.itemStartY - (this.mouseStartY - mouseEvent.clientY) < this.container.offsetTop) this.selectedItem.style.top = this.container.offsetTop
				else if (this.itemStartY - (this.mouseStartY - mouseEvent.clientY) > this.container.offsetTop + this.container.clientHeight) this.selectedItem.style.top = this.container.offsetTop
				else this.selectedItem.style.top = this.itemStartY - (this.mouseStartY - mouseEvent.clientY) + "px"
			}
		}
	}

	placeItem() {
		if (this.isUserMovingItem) {
			this.isUserMovingItem = false

			if (this.selectedItem.classList.contains("subtask")) {
				document.getElementById("placeholder").remove()
				let subtasks = [...document.querySelector("div.modal div.todo-item").children].slice(2)
				subtasks = subtasks.sort((a, b) => a.offsetTop - b.offsetTop)

				for (let i = 0; i < subtasks.length; i++) {
					subtasks[i].style.order = i + 1
				}
			}
			else {
				let tasks = [...document.querySelectorAll("#container .todo-item:not(.add-btn)")]
				let newOrder = tasks.sort((a, b) => a.offsetTop - b.offsetTop)
				newOrder.splice(newOrder.findIndex(task => task.id == "placeholder"), 1)
				document.getElementById("placeholder").remove()

				for (let i = 0; i < newOrder.length; i++) {
					newOrder[i].style.order = i
				}
				this.selectedItem.children[0].children[1].children[2].style.cursor = "grab"

				this.controller.changeOrder(this.selectedItem.id, newOrder.indexOf(this.selectedItem))
			}

			this.selectedItem.style.position = "static"
			this.selectedItem.style.zIndex = "0"
			this.selectedItem.style.width = "auto"
			document.body.style.cursor = "auto"
			this.selectedItem = null
		}
	}

	debounce(func, state, timeout = 1000){
		let timer
		return (...args) => {
			clearTimeout(timer)
			timer = setTimeout(() => { func.apply(this, args); }, timeout)
		}
	}

 	saveInput(){
		this.controller.check(this.changed).then(() => {this.changed = []})
	}
}

export { View }