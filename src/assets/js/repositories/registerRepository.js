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

    async checkEmailExists(emailAddress) {
        return await this.#networkManager.doRequest(this.#route + '/check-email',"POST", {emailAddress});
      //  return result
    }

    createRegister(firstname, surname, emailAddress, password) {
        return this.#networkManager.doRequest(this.#route, "POST",
            {firstname: firstname, surname: surname, emailAddress: emailAddress, password: password})
    }


}