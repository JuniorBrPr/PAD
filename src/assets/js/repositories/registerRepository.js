/**
 * Repository register
 * communicate with networkmanager
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class RegisterRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/register";
        this.#networkManager = new NetworkManager();
    }

     checkEmailExists(emailAddress) {
        const result = this.#networkManager.doRequest(this.#route, "GET", {emailAddress: emailAddress});
        return result.reason === "Email already exits";
    }

    createRegister(firstname, surname, emailAddress, password) {
        return this.#networkManager.doRequest(this.#route, "POST",
            {firstname: firstname, surname: surname, emailAddress: emailAddress, password: password})
    }


}