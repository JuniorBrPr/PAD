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

    createRegister(firstName, lastName, email, password, confirmPassword) {
       return this.#networkManager.doRequest(this.#route, "POST",
            {firstName: firstName, lastName: lastName, email: email, password: password, confirmPassword: confirmPassword})
    }
}