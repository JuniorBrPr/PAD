import {NetworkManager} from "../framework/utils/networkManager.js";

export class SurveyRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/survey"
        this.#networkManager = new NetworkManager();
    }

    async getAll() {
        return await this.#networkManager
            .doRequest(`${this.#route}/all`, "GET", {});
    }

    async getOptions(questionId) {
        return await this.#networkManager
            .doRequest(`${this.#route}/options/${questionId}`, "GET", {});
    }
}