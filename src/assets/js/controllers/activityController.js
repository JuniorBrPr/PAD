/**
 * Controller responsible for all events in activity view
 * @author Jayden Gunhan
 */

import {activityRepository} from "../repositories/activityRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class ActivityController extends Controller {

    #activityView
    #activityRepository

    constructor() {
        super();
        this.#activityRepository = new activityRepository

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into content class
     * @returns {Promise<void>}
     * @private
     */

    async #setupView() {
        //await for when HTML is loaded
        this.#activityView = await super.loadHtmlIntoContent("html_views/activity.html");

        //from here we can safely get elements from the view via the right getter
        this.#activityView.querySelector("span.name").innerHTML = App.sessionManager.get("username");

        //for demonstration a hardcoded activity goal that exists in the database of the back-end
        this.#fetchGoals(App.sessionManager.get("user_id"));
        this.#fetchScore(App.sessionManager.get("user_id"));
    }

    /**
     * async function that retrieves a room by its id via the right repository
     * @param userid the user you want to retrieve data from. (probably whoever is on the browser loading this in)
     * @private
     */

    async #fetchGoals(userid) {
        const activityTitle = this.#activityView.querySelector(".activity-title")
        const activityDescription = this.#activityView.querySelector(".activity-description")

        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const goalData = await this.#activityRepository.getGoals(userid);
            console.log(goalData)

            activityTitle.innerHTML = goalData[1].activity_name
            activityDescription.innerHTML = goalData[1].difficulty

        } catch (e) {
            console.log("error while fetching goals", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            activityDescription.innerHTML = e;
        }
    }

    async #fetchScore(userId) {
        const totalActivityScore = await this.#activityView.querySelector(".total-activity-score")

        try {
            const totalScore = await this.#activityRepository.getScore(userId);

            totalActivityScore.innerHTML = JSON.stringify(totalScore, null, 4);
        } catch (e) {
            console.log("error while fetching score", e)

            totalActivityScore.innerHTML = e;
        }
    }

    // async #handleCompletion(goal_id, user_id) {
    //     const completedgoal = null;
    //
    //     try {
    //
    //     } catch (e) {
    //
    //     }
    // }
}