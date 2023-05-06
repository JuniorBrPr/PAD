/**
 * Repository responsible for all activity related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Jayden.G
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
     * @author Jayden.G
     * Get goals for a user by their ID
     * @param {number|string} userid - User ID
     * @returns {Promise<>} - Goals data
     */

    async getGoals(userid) {
        return await this.#networkManager.doRequest(`${this.#route}/goals/${userid}`, "GET");
    }

    /**
     * @author Jayden.G
     * Get score for a user by their ID
     * @param {number|string} userid - User ID
     * @returns {Promise<>} - Total score
     */

    async getScore(userid) {
        return await this.#networkManager.doRequest(`${this.#route}/score/${userid}`, "GET");
    }

    /**
     * @author Jayden.G
     * Get goal templates
     * @returns {Promise<>} - Goal templates data
     */

    async getGoalTemplates() {
        return await this.#networkManager.doRequest(`${this.#route}/templates`, "GET");
    }

    /**
     * @author Jayden.G
     * Create goals using provided data
     * @param {Object} data - Data to create goals
     */

    async createGoals(data) {
        return await this.#networkManager.doRequest(`${this.#route}/create`, "PUT",
            [data]
        );
    }
}