import {NetworkManager} from "../framework/utils/networkManager.js";


export class profileRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/profile"
        this.#networkManager = new NetworkManager();
    }

    async getData(userId) {
        return await this.#networkManager.doRequest(`${this.#route}/${userId}`, "GET", userId);

    }

}