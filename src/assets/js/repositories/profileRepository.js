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
        this.#route = "/profile";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Retrieves profile data for a given user ID.
     * @returns {Promise<*>} A promise resolving to the user profile data.
     */
    async getData() {
        return await this.#networkManager.doRequest(`${this.#route}`, "GET");
    }

    /**
     * Retrieves user goals for a given user ID.
     * @returns {Promise<*>} A promise resolving to the user goals data.
     */
    async getUserGoals() {
        return await this.#networkManager.doRequest(`${this.#route}/userGoals`, "GET");
    }

    /**
     * Inserts a goal for a given user goal ID and value.
     * @param {string} userGoalID - The ID of the user goal.
     * @param {string} value - The value of the user goal.
     * @returns {Promise<*>} A promise resolving to the result of the insertion.
     */
    async insertGoal(userGoalID, value) {
        return await this.#networkManager.doRequest(`${this.#route}/insertGoal/${userGoalID}?&value=${value}`, "POST", {
            "usergoalID": userGoalID,
            "value": value
        });
    }

    /**
     * Updates the completion status of a user goal.
     * @param {string} userGoalID - The ID of the user goal to update.
     * @returns {Promise<*>} A promise resolving to the result of the update.
     */
    async updateGoalCompletion(userGoalID) {
        return await this.#networkManager.doRequest(`${this.#route}/goalCompletion/${userGoalID}`, "PUT", userGoalID);
    }

    /**
     * Calculates the daily goal completion percentage.
     * @returns {Promise<*>} A promise resolving to the daily goal completion percentage.
     */
    async calculateDailyGoalCompletionPercentage() {
        return await this.#networkManager.doRequest(`${this.#route}/dailyGoalCompletionPercentage`, "GET");
    }

    /**
     * Calculates the weekly goal completion percentage.
     * @returns {Promise<*>} A promise resolving to the weekly goal completion percentage.
     */
    async calculateWeeklyGoalCompletionPercentage() {
        return await this.#networkManager.doRequest(`${this.#route}/weeklyGoalCompletionPercentage`, "GET");
    }

    /**
     * Checks if a goal exists for a given user goal ID.
     * @param {string} usergoalID - The ID of the user goal to check.
     * @returns {Promise<*>} A promise resolving to the result of the existence check.
     */
    async checkIfGoalExists(usergoalID) {
        return await this.#networkManager.doRequest(`${this.#route}/checkIfGoalExists/${usergoalID}`, "GET");
    }

}
