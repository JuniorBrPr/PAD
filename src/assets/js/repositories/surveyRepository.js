import {NetworkManager} from "../framework/utils/networkManager.js";

/**
 * A repository for handling survey-related API requests.
 * @class
 * @public
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
     * Get all the unanswered surveys for the current user.
     * @async
     * @public
     * @returns {Promise<*>} - The response from the server
     * @author Junior Javier Brito Perez
     */
    async getUnansweredSurveys() {
        const response = await this.#networkManager
            .doRequest(`${this.#route}answered`, "GET");
        console.log(response);
        return response;
    }

    /**
     * Get a survey by its ID.
     * @async
     * @public
     * @param {number} surveyId - The ID of the survey to get.
     * @returns {Promise<*>} - The response from the server.
     * @author Junior Javier Brito Perez
     */
    async getSurvey(surveyId) {
        return await this.#networkManager
            .doRequest(`${this.#route}${surveyId}`, "GET");
    }

    /**
     * Get all the questions for a survey.
     * @async
     * @public
     * @param {number} surveyId - The ID of the survey to get the questions for.
     * @returns {Promise<*>} - The response from the server.
     * @author Junior Javier Brito Perez
     */
    async getQuestions(surveyId) {
        const response = await this.#networkManager
            .doRequest(`${this.#route}questions/${surveyId}`, "GET");
        console.log(response);
        return response;
    }

    /**
     * Get all the options for a question.
     * @async
     * @public
     * @param {number} questionId - The ID of the question to get the options for.
     * @returns {Promise<*>} - The response from the server.
     * @author Junior Javier Brito Perez
     */
    async getOptions(questionId) {
        const response = await this.#networkManager
            .doRequest(`${this.#route}options/${questionId}`, "GET");
        console.log(response);
        return response;
    }

    /**
     * Update the survey response for a user.
     *
     * @async
     * @public
     * @param {Object} data - The survey response data to update.
     * @returns {Promise<*>} - The response from the server.
     * @author Junior Javier Brito Perez
     */
    async putSurveyResult(data) {
        return await this.#networkManager
            .doRequest(`${this.#route}response`, "PUT", data);
    }

    /**
     *  @author Jayden.G
     *  Method to update the completion status to complete for a user
     */
    async setSurveyComplete() {
        return await this.#networkManager
            .doRequest(`${this.#route}status/complete`, "PUT");
    }

    /**
     *  @author Jayden.G
     *  Method to update the completion status to incomplete for a user
     */
    async setSurveyIncomplete() {
        return await this.#networkManager
            .doRequest(`${this.#route}status/incomplete`, "PUT");
    }

    /**
     *  @author Jayden.G
     *  Method to update the completion status surveys for a user
     */
    async getSurveyStatus() {
        return await this.#networkManager
            .doRequest(`${this.#route}status`, "GET");
    }
}