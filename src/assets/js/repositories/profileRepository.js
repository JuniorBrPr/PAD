import { profileRoutes } from '../server/routes/profileRoutes.js';

export class RoomsExampleRepository {
    //# is a private field in Javascript
    #route
    #profileRouteInstance

    constructor() {
        this.#route = "/rooms_example"
        this.#profileRouteInstance = new profileRoutes();
    }

    async getAll() {

    }

    async get(roomId) {
        return await this.#profileRouteInstance.doRequest(`${this.#route}/${roomId}`, "GET");
    }

    async create() {

    }

    async delete() {

    }

    async update(id, values = {}) {

    }
}