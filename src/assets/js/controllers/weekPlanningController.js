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


    }
}