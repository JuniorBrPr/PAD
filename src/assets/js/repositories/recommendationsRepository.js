import {NetworkManager} from "../framework/utils/networkManager.js";

export class recommendationsRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/recommendations/"
        this.#networkManager = new NetworkManager();
    }

    async getNutritionRecommendations(userId) {
        return await this.#networkManager
            .doRequest(`${this.#route}nutrition/${userId}`, "GET", {});
    }
}