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
        const data = await this.#networkManager
            .doRequest(`${this.#route}all`, "GET", {});

        return await this.getOptions(data);
    }

    //TODO: implement use of bearer token instead of userId
    async getNutritionSurvey(userId) {
        const data = await this.#networkManager
            .doRequest(`${this.#route}nutrition/${userId}`, "GET", {});

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

    //TODO: implement use of bearer token instead of userId
    async putSurveyResult(data, userId) {
        console.log(data);
        return await this.#networkManager
            .doRequest(`${this.#route}response/${userId}`, "PUT", data);
    }


}