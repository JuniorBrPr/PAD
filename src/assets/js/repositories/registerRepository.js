/**
 * Repository for register page
 * It communicates with the NetworkManager to perform network requests.
 * @author Hanan Ouardi
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class RegisterRepository {
    #networkManager;
    #route;

    /**
     * Constructs a new RegisterRepository object.
     * @author Hanan Ouardi
     */
    constructor() {
        this.#route = "/register";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Checks if an email address already exists.
     * @param {string} emailAddress - The email address to check.
     * @returns {Promise} A promise that resolves with the result of the network request.
     * @author Hanan Ouardi
     */
    async checkEmailExists(emailAddress) {
        return await this.#networkManager.doRequest(this.#route + '/check-email', "POST", {emailAddress});
    }

    /**
     * Creates a new user registration.
     * @param {string} firstname - The user's first name.
     * @param {string} surname - The user's surname.
     * @param {string} emailAddress - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise} A promise that resolves with the result of the network request.
     * @author Hanan Ouardi
     */
    async createRegister(firstname, surname, emailAddress, password) {
        return await this.#networkManager.doRequest(this.#route, "POST",
            {firstname: firstname, surname: surname, emailAddress: emailAddress, password: password})
    }


}