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
     * @returns {Promise<*>} A promise resolving to the user profile data.
     */
    async getData() {
        return await this.#networkManager.doRequest(`${this.#route}`, "GET");
    }

    async getUserGoals() {
        return await this.#networkManager.doRequest(`${this.#route}/userGoals`, "GET");
    }

    async insertGoal(userGoalID, value) {
        return await this.#networkManager.doRequest(`/profile/insertGoal/${userGoalID}?&value=${value}`, "POST", {
            "usergoalID": userGoalID,
            "value": value
        });
    }

    async updateGoalCompletion(userGoalID) {
        return await this.#networkManager.doRequest(`${this.#route}/goalCompletion/${userGoalID}`, "PUT", userGoalID);
    }

    async calculateDailyGoalCompletionPercentage() {
        return await this.#networkManager.doRequest(`${this.#route}/dailyGoalCompletionPercentage`, "GET");
    }

    async calculateWeeklyGoalCompletionPercentage() {
        return await this.#networkManager.doRequest(`${this.#route}/weeklyGoalCompletionPercentage`, "GET");
    }

    async checkIfGoalExists(usergoalID) {
        return await this.#networkManager.doRequest(`${this.#route}/checkIfGoalExists`, "GET", usergoalID);
    }
}
