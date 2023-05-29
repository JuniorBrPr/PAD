/**
 * EditProfileRepository class handles sending user profile data to the server.
 *
 * @author Joey_Poel
 * @class
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class editProfileRepository {
    /**
     * The route for the edit profile API.
     * @type {string}
     * @private
     */
    #route

    /**
     * The network manager instance for managing API requests.
     * @type {NetworkManager}
     * @private
     */
    #networkManager

    /**
     * Creates an instance of editProfileRepository.
     * @constructor
     */
    constructor() {
        this.#route = "/editProfile"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Updates the data of the current user.
     *
     * @returns {Promise<*>} A promise resolving to the user's data.
     */
    async sendData(firstname, surname, email, weight, height, age) {
        return await this.#networkManager.doRequest(`${this.#route}`, "PUT",
            {
                firstname: firstname,
                surname: surname,
                email: email,
                weight: weight,
                height: height,
                age: age
            });
    }

    /**
     * Retrieves profile data for a given user.
     *
     * @returns {Promise<*>} A promise resolving to the user profile data.
     */
    async getData() {
        return await this.#networkManager.doRequest(`/profile`, "GET");
    }
}