/**
 *
 * @author Jayden Gunhan
 */

import {activityRepository} from "../repositories/activityRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class ActivityController extends Controller {
    //# is a private field in Javascript
    #activityView
    #activityRepository

    constructor() {
        super();
        this.#activityRepository = new activityRepository

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .navigation div
     * @returns {Promise<void>}
     * @private
     */

    async #setupView() {
        //await for when HTML is loaded
        this.#activityView = await super.loadHtmlIntoContent("html_views/activity.html");

        //from here we can safely get elements from the view via the right getter
        this.#activityView.querySelector("span.name").innerHTML = App.sessionManager.get("username");

        //for demonstration a hardcoded activity goal that exists in the database of the back-end
        this.#fetchGoals();
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param userid the user you want to retrieve data from. (probably whoever is on the browser loading this in)
     * @private
     */

    async #fetchGoals(userid) {
        const exampleResponse = this.#activityView.querySelector(".example-response")

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const goalData = await this.#activityRepository.get(userid);

            exampleResponse.innerHTML = JSON.stringify(goalData, null, 4);
        } catch (e) {
            console.log("error while fetching goals", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            exampleResponse.innerHTML = e;
        }
    }

    // async #fetchGoals(userid) {
    //     const exampleResponse = this.#activityView.querySelector(".example-response")
    //
    //     try {
    //         //await keyword 'stops' code until data is returned - can only be used in async function
    //         const goalData = await this.#activityRepository.get(userid);
    //
    //         exampleResponse.innerHTML = JSON.stringify(goalData, null, 4);
    //     } catch (e) {
    //         console.log("error while fetching goals", e);
    //
    //         //for now just show every error on page, normally not all errors are appropriate for user
    //         exampleResponse.innerHTML = e;
    //     }
    // }
}