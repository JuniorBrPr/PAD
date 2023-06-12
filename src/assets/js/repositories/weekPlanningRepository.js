/**
 * Retrieves data from the database to populate the week planning
 * Handles communication with the network manager
 *
 * @author Hanan Ouardi
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class WeekPlanningRepository {
    #networkManager;
    #route;

    /**
     * Constructs a WeekPlanningRepository object.
     * Initializes the route and network manager.
     */
    constructor() {
        this.#route = "/planning"
        this.#networkManager = new NetworkManager();
    }

    /**
     * Retrieves the user goals for the current user.
     * @returns {Promise<Array>} A promise resolving to an array the user's activities.
     *
     * @author Hanan Ouardi
     */
    async userActivities() {
        //The await keyword is used to pause the execution of the function until the Promise returned by this.#networkManager.doRequest() is resolved.
        //no async: doRequest without waiting for the completion, returns unresolved promise
        return await this.#networkManager.doRequest(`${this.#route}`, "GET", {});

    }

    /**
     * Updates the completed status of a user activity.
     * @param {string} userId - The ID of the user.
     * @param {boolean} completed - The completion status of the activity.
     * @param {string} selectedDate - The selected date for the activity.
     * @param {Array<string>} userActivityId - The IDs of the user activities.
     * @returns {Promise<Array>} A promise resolving to an array of the updated user activities.
     *
     * @author Hanan Ouardi
     */
    async userCompletedActivity(userId, completed, selectedDate, userActivityId) {
        const promiseActivity = userActivityId.map(userActivityId => { //array map to iterate over each userActivityId
            return this.#networkManager.doRequest(`${this.#route}`, "POST", {
                "userId": userId,
                "completed": completed,
                "date": selectedDate,
                "usergoalID": userActivityId

            });
        });
        //The Promise.all method returns a new promise that resolves to an array of the resolved values.
        return Promise.all(promiseActivity); //wait for all the promises to resolve before return final result
    }

}