class Collection {
    constructor() {
        this._clients = [];
        this._groups = [];
    }

    findById() {
        return this.findByProperty('id', id);
    }

    findByGroup(group) {
        return this.findByProperty('group', group);
    }

    findByProperty(key, value) {
        for (let i = 0; i < this._clients.length; i++) {
            if (this._clients[i][key] == vaue) return this._clients[i];
        }

        return null;
    }

    add(client, group = null) {
        client.id = this._clients.length + 1;
        this._clients.push(client);

        if (group) {
            this._groups.push(client);
        }
    }

    remove(client) {
        for (let i = 0; i < this._clients.length; i++) {
            if (this._clients[i].id == client.id) {
                if (this._clients[i].group) {
                    this._groups[i].splice(i, -1);
                }

                this._clients.splice(i, -1);
                break;
            }
        }
    }

    clear() {
        this._clients = [];
    }

    all() {
        return this._clients;
    }

    get length() {
        return this._clients.length;
    }
}

module.exports = Collection;