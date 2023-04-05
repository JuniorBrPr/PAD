import {NetworkManager} from "../framework/utils/networkManager.js";

export class SurveyRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/survey/"
        this.#networkManager = new NetworkManager();
    }

    async getUnansweredSurveys(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}answered/${userId}`, "GET", {});
    }

    async getAll() {
        return await this.#networkManager
            .doRequest(`${this.#route}all`, "GET", {});
    }

    async getQuestions(userId, surveyId) {
        return await this.#networkManager
            .doRequest(`${this.#route}questions`, "POST", {surveyId: surveyId, userId: userId});
    }

    //TODO: implement use of bearer token instead of userId
    async putSurveyResult(data, userId) {
        console.log(data);
        return await this.#networkManager
            .doRequest(`${this.#route}response/${userId}`, "PUT", data);
    }
}