/**
 * Repository responsible for all homepage data from server
 *
 * @author Jayden Gunhan
 */

import { NetworkManager } from "../framework/utils/networkManager.js";

export class HomeRepository {
    #route
    #networkManager

    constructor() {
        this.#route = "/home"
        this.#networkManager = new NetworkManager();
    }

    async getData() {
        return await this.#networkManager
            .doRequest(`${this.#route}/data`, "GET");
    }
}