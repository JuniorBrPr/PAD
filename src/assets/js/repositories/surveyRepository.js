import {NetworkManager} from "../framework/utils/networkManager.js";

/**
 * Repository for survey related requests.
 *
 * @class SurveyRepository
 * @classdesc Sends requests relating to the surveys and returns the responses.
 * @property {string} #route - The route to the survey api.
 * @property {NetworkManager} #networkManager - The network manager to handle requests.
 * @memberof repositories
 * @author Junior Javier Brito Perez
 */
export class SurveyRepository {
    #route
    #networkManager

    /**
     * Create a new SurveyRepository.
     */
    constructor() {
        this.#route = "/survey/"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Get all surveys that the user has not answered.
     * @async
     * @public
     * @function getUnansweredSurveys
     * @param {number} userId - The id of the user
     * @returns {Promise<*>} - The response from the server
     * @author Junior Javier Brito Perez
     */
    async getUnansweredSurveys(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}answered/${userId}`, "GET", {});
    }

    /**
     * Get all the questions in the database.
     * @async
     * @public
     * @function getAll
     * @returns {Promise<*>} - The response from the server
     * @author Junior Javier Brito Perez
     */
    async getAll() {
        const data = await this.#networkManager
            .doRequest(`${this.#route}all`, "GET", {});

        return await this.getOptions(data);
    }

    /**
     * Get all the questions in the nutrition survey.
     * @async
     * @public
     * @param userId
     * @returns {Promise<*>}
     * @author Junior Javier Brito Perez
     */
    async getNutritionSurvey(userId) {
        const data = await this.#networkManager
            .doRequest(`${this.#route}nutrition/${userId}`, "GET", {});

        return await this.getOptions(data);
    }

    /**
     * Get all the options for the questions.
     * @async
     * @public
     * @param {[Object]} data - The questions to get the options for.
     * @returns {Promise<*>} - The response from the server
     * @author Junior Javier Brito Perez
     */
    async getOptions(data) {
        for (let i = 0; i < data.length; i++) {
            const question = data[i];
            if (question.type === "multipleChoice" || question.type === "singleChoice") {
                if (question.type === "multipleChoice" || question.type === "singleChoice") {
                    question.options = await this.#networkManager
                        .doRequest(`${this.#route}options/${question.id}`, "GET", {});
                }
            }
        }
        return data;
    }

    /**
     * Get all the questions in the physical activity survey.
     * @async
     * @public
     * @param {[Object]} data - The questions to get the options for.
     * @param {number} userId - The id of the user
     * @returns {Promise<*>} - The response from the server
     */
    async putSurveyResult(data, userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}response/${userId}`, "PUT", data);
    }

    /**
     *  @author Jayden.G
     *  Method to update the completion status to complete for a user
     *
     *  @param {number}userId The user you want to change the survey status to complete of
     */
    async setSurveyComplete(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}status/complete/${userId}`, "PUT", {});
    }

    /**
     *  @author Jayden.G
     *  Method to update the completion status to incomplete for a user
     *
     *  @param {number}userId The user you want to change the survey status to incomplete of
     */
    async setSurveyIncomplete(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}status/incomplete/${userId}`, "PUT", {});
    }

    /**
     *  @author Jayden.G
     *  Method to update the completion status surveys for a user
     *
     *  @param {number}userId The user you want to retrieve the survey status of
     */
    async getSurveyStatus(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}status/${userId}`, "GET", {});
    }
}