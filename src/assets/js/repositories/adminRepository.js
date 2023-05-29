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

    /**
     * Creates a new instance of the AdminRepository class.
     * @constructor
     */

    constructor() {
        this.#route = "/admin"
        this.#networkManager = new NetworkManager();
    }

    /**
     * @author Jayden.G
     * Retrieves survey results from the server.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing survey results.
     * @throws {Error} Throws an error if there is a problem performing the operation.
     */

    async getSurveyResults() {
        return await this.#networkManager.doRequest(`${this.#route}/survey_data`, "GET");
    }

    /**
     * @author Jayden.G
     * Retrieves nutrition survey content from the server.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing nutrition survey content.
     * @throws {Error} Throws an error if there is a problem performing the operation.
     */

    async getNutritionSurveyContent() {
        return await this.#networkManager.doRequest(`${this.#route}/survey_content/nutrition`, "GET")
    }

    /**
     * @author Jayden.G
     * Retrieves exercise survey content from the server.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing exercise survey content.
     * @throws {Error} Throws an error if there is a problem performing the operation.
     */

    async getExerciseSurveyContent() {
        return await this.#networkManager.doRequest(`${this.#route}/survey_content/exercise`, "GET")
    }
}