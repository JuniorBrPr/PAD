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
     * Constructs a new ProfileRepository object.
     * Initializes the route and network manager.
     */
    constructor() {
        this.#route = "/profile";
        this.#networkManager = new NetworkManager();
    }

    /**
     * Retrieves profile data for a given user.
     *
     * @returns {Promise<*>} A promise resolving to the user profile data.
     */
    async getData() {
        return await this.#networkManager.doRequest(`${this.#route}`, "GET");
    }

    /**
     * Retrieves the user goals for the current user.
     *
     * @returns {Promise<*>} A promise resolving to the user's goals.
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
     * Updates a user's goal completion status in the API.
     *
     * @param {number} userGoalID - The ID of the user's goal.
     * @returns {Promise<*>} A promise resolving to the updated user goal data.
     */
    async updateGoalCompletion(userGoalID) {
        return await this.#networkManager.doRequest(`${this.#route}/goalCompletion/${userGoalID}`, "PUT", userGoalID);
    }

    /**
     * Calculates the daily goal completion percentage for the current user.
     *
     * @returns {Promise<*>} A promise resolving to the daily goal completion percentage.
     */
    async calculateDailyGoalCompletionPercentage() {
        return await this.#networkManager.doRequest(`${this.#route}/dailyGoalCompletionPercentage`, "GET");
    }

    /**
     * Calculates the weekly goal completion percentage for the current user.
     *
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
