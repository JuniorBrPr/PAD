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
        //this.#activityView.querySelector("span.name").innerHTML = App.sessionManager.get("firstname");

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

        //TODO: Getting all of our relevant html elements, i dont like how this looks so mby we change this yes??

        const prevActivityDescription = this.#activityView.querySelector(".prev-activity-description")
        const prevActivityDate = this.#activityView.querySelector(".prev-activity-date")

        const currentActivityDescription = this.#activityView.querySelector(".current-activity-description")
        const currentActivityDate = this.#activityView.querySelector(".current-activity-date")

        const nextActivityDescription = this.#activityView.querySelector(".next-activity-description")
        const nextActivityDate = this.#activityView.querySelector(".next-activity-date")

        const favoriteActivity = await this.#activityView.querySelector(".favorite-activity")

        try {
            const goalData = await this.#activityRepository.getGoals(userid);

            /**
             * TODO: Validate the dates of every goal and make sure they come in the exact right order for when we
             *       query more than just today and the adjacent goals.
             */

            //previous goal data
            prevActivityDescription.innerHTML = App.ActivityHelper.getDescription(goalData[0].difficulty,
                goalData[0].activity_name);
            prevActivityDate.innerHTML = goalData[0].startdate.substring(0, 10);

            //current goal data
            currentActivityDescription.innerHTML = App.ActivityHelper.getDescription(goalData[1].difficulty,
                goalData[1].activity_name);
            currentActivityDate.innerHTML = goalData[1].startdate.substring(0, 10);

            //next goal data
            nextActivityDescription.innerHTML = App.ActivityHelper.getDescription(goalData[2].difficulty,
                goalData[2].activity_name);
            nextActivityDate.innerHTML = goalData[2].startdate.substring(0, 10);

            //favorite activity
            favoriteActivity.innerHTML = App.ActivityHelper.getFavoriteActivity(goalData);
        } catch (e) {
            console.log("error while fetching goals", e);

            //for now just show every error on page, normally not all errors are appropriate for user
            currentActivityDescription.innerHTML = e;
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

    //TODO: Handle goal streak

    //TODO: Handle creation of goals

    //TODO: Handle completion of goals, Repository and Route functions already created but not tested :D

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