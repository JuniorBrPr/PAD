import {NetworkManager} from "../framework/utils/networkManager.js";

export class SurveyRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/survey/"
        this.#networkManager = new NetworkManager();
    }

    async getAll() {
        const data = await this.#networkManager
            .doRequest(`${this.#route}all`, "GET", {});

        return await this.getOptions(data);
    }

    async getNutritionSurvey() {
        const data = await this.#networkManager
            .doRequest(`${this.#route}nutrition`, "GET", {});

        return await this.getOptions(data);
    }

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

    // todo: implement use of bearer token instead of userId
    async putSurveyResult(data, userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}response/${userId}`, "PUT", data);
    }
}