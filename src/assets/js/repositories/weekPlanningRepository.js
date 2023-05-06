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

    async dataWeekPlanning(id) {
        return await this.#networkManager.doRequest(`${this.#route}`, "GET", {});
    }

}