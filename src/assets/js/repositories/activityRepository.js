/**
 * Repository responsible for all activity related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 * @author Jayden Gunhan
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class activityRepository {

    #route
    #networkManager

    constructor() {
        this.#route = "/activity"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Async function to get a piece of activity data by its id via networkmanager
     * in the back-end we define :goalId as parameter at the end of the endpoint
     *
     * GET requests don't send data via the body like a POST request but via the url
     * @param userid
     * @returns {Promise<>}
     */

    async getGoals(userid) {
        return await this.#networkManager.doRequest(`${this.#route}/goals/${userid}`, "GET");
    }

    async getScore(userid) {
        return await this.#networkManager.doRequest(`${this.#route}/score/${userid}`, "GET");
    }

    async updateGoal(userid, goalid, endDate) {
        return await this.#networkManager.doRequest(`${this.#route}/goals/${userid}/${goalid}`, "POST",
            {"goalid": goalid, "end_date": endDate})
    }

    async create() {

    }

    async delete() {

    }

    async update(id, values = {}) {

    }
}