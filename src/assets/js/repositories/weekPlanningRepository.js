/**
 * Ontvangt de data van de database om in de planning te zetten
 *
 * @author Hanan Ouardi
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class WeekPlanningRepository {
    #networkManager;
    #route;

    constructor() {
        this.#route = "/planning"
        this.#networkManager = new NetworkManager();
    }
    /**
     * Retrieves the user goals for the current user.
     *
     * @returns {Promise<*>} A promise resolving to the user's goals.
     */
    async userActivities() {
        return await this.#networkManager.doRequest(`${this.#route}`, "GET", {});

    }

    /**
     *
     * @param selectedDate
     * @param cloneButtonComplete
     * @param cloneButtonDelete
     * @returns {Promise<*>}
     */

   async userCompletedActivity(userId, completed, selectedDate, userActivityId ) {
       const testPromise = userActivityId.map(userActivityId => {
        return this.#networkManager.doRequest(`${this.#route}`, "POST", {
           "userId": userId,
            "completed": completed,
            "date": selectedDate,
            "usergoalID": userActivityId

        });
       });
        return Promise.all(testPromise);
    }
}