import {NetworkManager} from "../framework/utils/networkManager.js";

export class ActivityFrequencyRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/activity/";
        this.#networkManager = new NetworkManager;

    }

    async getFrequencySurvey(){
        const data = await this.#networkManager
            .doRequest(`${this.#route}frequency`, "GET", {});

        return await this.getOptions(data);
    }

    async getQuestions(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}questions`, "GET", {});
    }

    async getOptions() {
        return await this.#networkManager
            .doRequest(`${this.#route}answerOptions`, "GET", {});
    }

    async postSurveyAnswers(data, userId) {
        console.log(data);
        return await this.#networkManager
            .doRequest(`${this.#route}putAnswers/${userId}`, "PUT", {});
    }
}