/**
 * Controller responsible for all events in activity view
 * @author Jayden.G
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
     * @author Jayden.G
     * Loads contents of desired HTML file into content class
     *
     * @returns {Promise<void>}
     * @private
     */
    async #setupView() {
        this.#activityView = await super.loadHtmlIntoContent("html_views/selectGoal.html");

        await this.#loadGoalTemplates();
    }

    /**
     * @author Jayden.G & Junior.B
     * Loads goal templates and puts the fetched data into the activity view with the templates from selectGoal.
     *
     * Each goal card displays the template's name, base value, unit, and description.
     * Users can select a goal, which will reveal selectable days for submitting the goal.
     * When a goal is submitted, the #handleGoalSubmit method is called with the goal's id and base value.
     * @private
     */

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
     * @author Jayden.G
     * Handles the submission of a goal by saving the selected goals to the activity repository.
     * This function is asynchronous and should be called with the 'await' keyword.
     *
     * @function handleGoalSubmit
     * @param {number|string} templateId - The templateId refers to which template. This value
     * is bound to what goal it is in the #loadGoalTemplates function.
     * @param {*} templateValue - The value associated with the template which refers to the
     * goal value. This is also bound to what the value of the goal in #loadGoalTemplates is.
     *
     * @throws {Error} If no days are selected.
     * @returns {Promise<void>} A promise that resolves when the goals are successfully saved.
     * @private
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
            // TODO: Display this message!
            console.log("No days selected...");
        } else {
            console.log("trying to save selected goals...");

            let data = [];

            const date = new Date()

            console.log(date.toISOString())

            selectedDays.forEach((day) => {
                data.push([
                    null,
                    App.sessionManager.get("user_id"),
                    templateId,
                    date.toISOString().substring(0, 10),
                    day,
                    templateValue
                ]);
            });

            console.log(data);

            await this.#activityRepository.createGoals(data);
        }
    }

    /**
     * @author Jayden.G
     * Asynchronously fetches goal templates from the activity repository.
     *
     * @function fetchGoalTemplates
     * @returns {Promise<Array>} A promise that resolves to an array of goal templates.
     * @private
     */

    async #fetchGoalTemplates() {
        return await this.#activityRepository.getGoalTemplates();
    }
}