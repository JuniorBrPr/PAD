/**
 * ProfileRepository class.
 * Handles API communication related to user profiles.
 *
 * @author Joey_Poel
 */

import {NetworkManager} from "../framework/utils/networkManager.js";

export class profileRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    /**
     * ProfileRepository constructor.
     * Initializes route and network manager.
     */
    constructor() {
        this.#route = "/profile"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Retrieves profile data for a given user ID.
     * @param {string} userId - The user ID to fetch profile data for.
     * @returns {Promise<*>} A promise resolving to the user profile data.
     */
    async getData(userId) {
        return await this.#networkManager.doRequest(`${this.#route}/${userId}`, "GET", userId);
    }

    async getUserGoals(userId) {
        return await this.#networkManager.doRequest(`${this.#route}/userGoals/${userId}`, "GET", userId);
    }
    async getGoals(userId) {
        return await this.#networkManager.doRequest(`${this.#route}/goals/${userId}`, "GET", userId);
    }

    async insertGoal(userGoalID, userId, value) {
        return await this.#networkManager.doRequest(`/profile/insertGoal/${userGoalID}?userId=${userId}&value=${value}`, "POST", {
            "usergoalID": userGoalID,
            "userId": userId,
            "value": value
        });
    }


    async updateGoalCompletion(userGoalID) {
        return await this.#networkManager.doRequest(`${this.#route}/goalCompletion/${userGoalID}`, "PUT", userGoalID);
    }

    async calculateDailyGoalCompletionPercentage(userId) {
        return await this.#networkManager.doRequest(`${this.#route}/goalCompletionPercentage/${userId}`, "PUT", userId);
    }

}
