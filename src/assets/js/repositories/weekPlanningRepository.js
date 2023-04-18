/**
 * Ontvangt de data van de database om in de planning te zetten
 *
 * @author Hanan Ouardi
 */
import {NetworkManager} from "../framework/utils/networkManager.js";

export class PlanningRepository {
    #networkManager;
    #route;


    constructor() {
         this.#route = "/planning"  /**aanpassen*/
         this.#networkManager = new NetworkManager();
    }

    createPlanning() {
        this.#networkManager.doRequest(this.#route, "GET", {})
    }

}