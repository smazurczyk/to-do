import { Service } from "./Service.js"
import { Model } from "./Model.js"

class Controller {
    constructor(view) {
        this.service = new Service()
        this.model = new Model(view)
        this.view = view
    }

    async getAllTasks() {
        try {
            const tasks = await this.service.getAll()
            for(const task of tasks) this.model.add(task)
        }
        catch (e) {
            this.view.displayError(e)
        }
    }

    async add(data) {
        try {
            const newTask = await this.service.add(data)
            this.model.add(newTask)
        }
        catch (e) {
            this.view.displayError(e)
        }
    }

    async remove(id) {
        try {
            await this.service.remove(id)
            this.model.remove(id)
        }
        catch (e) {
            this.view.displayError(e)
        }
    }

    getDataById(id) {
        return this.model.getDataById(id)
    }

    async replace(id, data) {
        try {
            const task = await this.service.replace(id, data)
            this.model.replace(id, task)
        }
        catch (e) {
            this.view.displayError(e)
        }
    }

    async changeOrder(id, newIndex) {
        try {
            if(this.model.getIndexById(id) != newIndex) {
                await this.service.changeOrder(id, newIndex)
                this.model.changeOrder(id, newIndex)
            }
        }
        catch (e) {
            this.view.displayError(e)
        }
    }

    async check(data) {
        try {
            data = this.model.filter(data)
            const response = await this.service.check(data)
            this.model.check(response)
        }
        catch (e) {
            this.view.displayError(e)
        }
    }
}

export {Controller}