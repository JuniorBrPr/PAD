import {NetworkManager} from "../framework/utils/networkManager.js";

export class SortedActivitiesRepository {
    #route;
    #networkManager;

    constructor() {
        this.#route = "/activities/";
        this.#networkManager = new NetworkManager;

    }

    async getActivities() {
        return await this.#networkManager
            .doRequest(`${this.#route}all`, "GET", {});
    }
}