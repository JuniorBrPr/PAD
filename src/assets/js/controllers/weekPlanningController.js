/**
 * Controller weekplanning
 * @author Hanan Ouardi
 */

import {Controller} from "./controller.js";

import { App } from "../app.js";

export class WeekPlanningController extends Controller{

    #planningView

    constructor() {
        super();

        this.#setupViewPlanning()
    }

    async #setupViewPlanning(){
        this.#planningView = await super.loadHtmlIntoContent("html_views/weekPlanning.html")

        //this.#planningView.addEventListener("click", event => this.#handleWeekplanning(event));
        this.#handleWeekplanning();
    }

    async #handleWeekplanning() {
       // event.preventDefault();
        console.log("hoi")
        /**
         * Datum dag
         * @type {Date}
         */
        let dateToday = this.#planningView.querySelector("#todayDate").valueAsDate = new Date();
       // let today = new Date();
        let dd = String(dateToday.getDate()).padStart(2, '0');
        let mm = String(dateToday.getMonth() + 1).padStart(2, '0'); //jan is 0
        let yyyy = dateToday.getFullYear();

        dateToday = dd + '/' + mm + '/' + yyyy;
        document.querySelector("#todayDate").innerHTML = dateToday;
      //  document.write(dateToday);

    }
}