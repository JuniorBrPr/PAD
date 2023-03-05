/**
 *
 * @author Jayden Gunhan
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class activityRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/user_goal"
        this.#networkManager = new NetworkManager();
    }

    async getAll() {

    }

    /**
     * Async function to get a piece of room example data by its id via networkmanager
     * in the back-end we define :roomId as parameter at the end of the endpoint
     *
     * GET requests don't send data via the body like a POST request but via the url
     * @param userid
     * @returns {Promise<>}
     */
    async get(userid) {
        return await this.#networkManager.doRequest(`${this.#route}/${userid}`, "GET");
    }

    async create() {

    }

    async delete() {

    }

    async update(id, values = {}) {

    }
}