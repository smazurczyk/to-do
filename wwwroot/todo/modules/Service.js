class Service {
    async getAll() {
        let response = await fetch("api")
        response = await response.json()

        if(response.Ok) return response.Data
        else throw new Error(response.Error)
    }

    async add(body) {
        let response = await fetch("api", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
        response = await response.json()
        
        if(response.Ok) return response.Data
        else throw new Error(response.Error)
    }

    async remove(id) {
        let response = await fetch(`api/${id}`, {
            method: "DELETE",
        })
        response = await response.json()

        if(!response.Ok) throw new Error(response.Error)
    }

    async replace(id, body) {
        let response = await fetch(`api/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
        response = await response.json()
        
        if(response.Ok) return response.Data
        else throw new Error(response.Error)
    }

    async changeOrder(id, newIndex) {
        let response = await fetch(`api/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({value: newIndex})
        })
        response = await response.json()

        if(!response.Ok) throw new Error(response.Error)
    }

    async check(body) {
        let response = await fetch(`api`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
        response = await response.json()
        
        if(response.Ok) return response.Data
        else throw new Error(response.Error)
    }
}

export {Service}