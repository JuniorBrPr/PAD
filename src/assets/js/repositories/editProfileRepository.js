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
     * Sends user profile data to the server.
     *
     * @param {string} firstname - The user's first name.
     * @param {string} surname - The user's surname.
     * @param {string} email - The user's email.
     * @param {number} weight - The user's weight.
     * @param {number} height - The user's height.
     * @param {number} age - The user's age.
     * @param {number} userId - The user's ID.
     * @return {Promise<*>} - The response from the server.
     */
    async sendData(firstname, surname, email, weight, height, age, userId) {
        return await this.#networkManager.doRequest(`${this.#route}/${userId}`, "PUT",
            {
                firstname: firstname,
                surname: surname,
                email: email,
                weight: weight,
                height: height,
                age: age,
                userId: userId
            });
    }
}