import {NetworkManager} from "../framework/utils/networkManager.js";

export class recommendationsRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/recommendations/"
        this.#networkManager = new NetworkManager();
    }

    async getNutritionRecommendations() {
        return await this.#networkManager
            .doRequest(`${this.#route}nutrition`, "GET", {});
    }
}