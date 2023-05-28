/**
 * Repository responsible for all activity related data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with `networkManager`!
 *
 * @author Jayden.G
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class AdminRepository {

    #route
    #networkManager

    constructor() {
        this.#route = "/admin"
        this.#networkManager = new NetworkManager();
    }

    /**
     * @author Jayden.G
     * Gets data for the admin page
     * @returns {Promise<>} - data
     */

    async getSurveyResults() {
        return await this.#networkManager.doRequest(`${this.#route}/survey_data`, "GET");
    }

    async getNutritionSurveyContent() {
        return await this.#networkManager.doRequest(`${this.#route}/survey_content/nutrition`, "GET")
    }

    async getExerciseSurveyContent() {
        return await this.#networkManager.doRequest(`${this.#route}/survey_content/exercise`, "GET")
    }
}