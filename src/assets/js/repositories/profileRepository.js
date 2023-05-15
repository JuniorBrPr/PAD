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
     * Retrieves all goals from the API.
     *
     * @returns {Promise<*>} A promise resolving to all goals.
     */
    async getGoals() {
        return await this.#networkManager.doRequest(`${this.#route}/goals`, "GET");
    }

    /**
     * Inserts a new user goal into the API.
     *
     * @param {number} userGoalID - The ID of the user's goal.
     * @param {number} value - The value of the user's goal.
     * @returns {Promise<*>} A promise resolving to the new user goal data.
     */
    async insertGoal(userGoalID, value) {
        return await this.#networkManager.doRequest(`/profile/insertGoal/${userGoalID}?&value=${value}`, "POST", {
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
}