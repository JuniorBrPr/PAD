import {NetworkManager} from "../framework/utils/networkManager.js";

/**
 * A class representing a repository for retrieving and posting recommendations.
 * @class
 * @author Junior Javier Brito Perez
 */
export class recommendationsRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/recommendations/"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Retrieves nutrition recommendations from the server.
     * @async
     * @function
     * @public
     * @returns {Promise<Array>} A promise that resolves with an array of nutrition recommendations.
     * @author Junior Javier Brito Perez
     */
    async getNutritionRecommendations() {
        return await this.#networkManager
            .doRequest(`${this.#route}nutrition`, "GET", {});
    }

    /**
     * Retrieves exercise recommendations from the server.
     * @async
     * @function
     * @public
     * @returns {Promise<Array>} A promise that resolves with an array of exercise recommendations.
     * @author Junior Javier Brito Perez
     */
    async getExerciseRecommendations() {
        return await this.#networkManager
            .doRequest(`${this.#route}exercise`, "GET", {});
    }

    /**
     * Posts user goals to the server.
     * @async
     * @function
     * @public
     * @param {Object} goals - The user's goals to be posted to the server.
     * @returns {Promise} A promise that resolves when the goals have been successfully posted to the server.
     * @author Junior Javier Brito Perez
     */
    async postGoals(goals) {
        return await this.#networkManager
            .doRequest(`${this.#route}`, "POST", goals);
    }
}