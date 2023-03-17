import {NetworkManager} from "../framework/utils/networkManager.js";


export class editProfileRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/editProfile"
        this.#networkManager = new NetworkManager();
    }

    async getData(userId) {
        return await this.#networkManager.doRequest(`${this.#route}/${userId}`, "POST", userId);
    }
}