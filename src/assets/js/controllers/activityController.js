/**
 * Controller responsible for all events in activity view
 * @author Jayden Gunhan
 */

import {activityRepository} from "../repositories/activityRepository.js";
import {Controller} from "./controller.js";
import {App} from "../app.js";

export class ActivityController extends Controller {

    #activityView
    #goalTemplate
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
        this.#activityView = await super.loadHtmlIntoContent("html_views/selectGoal.html");

        await this.#loadGoalTemplates();
    }

    async #loadGoalTemplates() {
        const data = await this.#fetchGoalTemplates();
        const goalTemplate = this.#activityView.querySelector("#goalTemplate").cloneNode(true);

        for (const template of data) {
            const card = goalTemplate.content.querySelector(".card").cloneNode(true);
            card.querySelector(".card-title").innerText = `${template.baseValue} ${template.unit} ${template.name}`;
            card.querySelector(".card-text").innerText = template.description;

            const daysContainer = card.querySelector(".daysContainer");

            card.dataset.id = template.id;

            card.querySelector(".selectGoal").addEventListener("click", () => {
                if (daysContainer.style.display === "none") {
                    daysContainer.style.display = "block";
                } else {
                    daysContainer.style.display = "none";
                }
            });

            card.querySelector(".submitGoal").addEventListener("click", () => {
                this.#handleGoalSubmit(template.id, template.baseValue);
            });

            this.#activityView.querySelector(".templatesContainer").appendChild(card);
        }
    }

    /**
     *
     * @returns {*[selectedDays]}
     */

    async #handleGoalSubmit(templateId, templateValue) {
        const checkboxes = this.#activityView.querySelector(
            `[data-id="${templateId}"]`).querySelector(
            ".daysContainer").querySelectorAll(
            ".form-check-input"
        );

        const selectedDays = [];
        const days = [1, 2, 3, 4, 5, 6, 7];

        console.log(templateId)

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                selectedDays.push(days[index]);
            }
        });

        if (selectedDays.length === 0) {
            console.log("No days selected");
        } else {
            console.log("trying to save selected goals...");
            console.log([App.sessionManager.get("user_id"), templateId, selectedDays, templateValue]);

            await this.#activityRepository.createGoals(
                App.sessionManager.get("user_id"), templateId, selectedDays, templateValue
            );
        }
    }

    async #fetchGoalTemplates() {
        return await this.#activityRepository.getGoalTemplates();
    }

    // async #fetchGoals() {
    //
    //     //TODO: Getting all of our relevant html elements, i dont like how this looks so mby we change this yes??
    //
    //     const prevActivityDescription = this.#activityView.querySelector(".prev-activity-description")
    //     const prevActivityDate = this.#activityView.querySelector(".prev-activity-date")
    //
    //     const currentActivityDescription = this.#activityView.querySelector(".current-activity-description")
    //     const currentActivityDate = this.#activityView.querySelector(".current-activity-date")
    //
    //     const nextActivityDescription = this.#activityView.querySelector(".next-activity-description")
    //     const nextActivityDate = this.#activityView.querySelector(".next-activity-date")
    //
    //     try {
    //         const goalData = await this.#activityRepository.getGoals(userid);
    //
    //         /**
    //          * TODO: Validate the dates of every goal and make sure they come in the exact right order for when we
    //          *       query more than just today and the adjacent goals.
    //          */
    //
    //         //previous goal data
    //         prevActivityDescription.innerHTML = App.ActivityHelper.getDescription(goalData[0].difficulty,
    //             goalData[0].activity_name);
    //         prevActivityDate.innerHTML = goalData[0].startdate.substring(0, 10);
    //
    //         //current goal data
    //         currentActivityDescription.innerHTML = App.ActivityHelper.getDescription(goalData[1].difficulty,
    //             goalData[1].activity_name);
    //         currentActivityDate.innerHTML = goalData[1].startdate.substring(0, 10);
    //
    //         //next goal data
    //         nextActivityDescription.innerHTML = App.ActivityHelper.getDescription(goalData[2].difficulty,
    //             goalData[2].activity_name);
    //         nextActivityDate.innerHTML = goalData[2].startdate.substring(0, 10);
    //
    //     } catch (e) {
    //         console.log("error while fetching goals", e);
    //
    //         //for now just show every error on page, normally not all errors are appropriate for user
    //         currentActivityDescription.innerHTML = e;
    //     }
    // }

    //TODO: Handle goal streak

    //TODO: Handle creation of goals

    //TODO: Handle completion of goals

    // async #fetchFavoriteActivity(userId){
    //     return await this.#activityRepository.getFavoriteActivity(
    //         App.sessionManager.get("user_id")
    //     );
    // }

    // async #handleCompletion(goal_id, user_id) {
    //     const completedgoal = null;
    //
    //     try {
    //
    //     } catch (e) {
    //
    //     }
    // }

    // async #fetchScore(userId) {
    //     const totalActivityScore = await this.#activityView.querySelector(".total-activity-score")
    //
    //     try {
    //         const totalScore = await this.#activityRepository.getScore(userId);
    //
    //         totalActivityScore.innerHTML = JSON.stringify(totalScore, null, 4);
    //     } catch (e) {
    //         console.log("error while fetching score", e)
    //
    //         totalActivityScore.innerHTML = e;
    //     }
    // }
}