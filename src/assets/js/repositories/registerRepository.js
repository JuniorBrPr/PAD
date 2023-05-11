/**
 * Repository register
 * communicate with networkmanager
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class RegisterRepository{
    #networkManager;
    #route;

    constructor(){
        this.#route = "/register";
        this.#networkManager = new NetworkManager();
    }

    createRegister(firstname, surname, emailAddress, password) {
       return this.#networkManager.doRequest(this.#route, "POST",
            {firstname: firstname, surname: surname, emailAddress: emailAddress , password: password})
    }
}