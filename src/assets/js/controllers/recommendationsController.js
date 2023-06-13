import {Controller} from "./controller.js";
import {recommendationsRepository} from "../repositories/recommendationsRepository.js";
import {SurveyRepository} from "../repositories/surveyRepository.js";

/**
 * Controller for managing recommendations.
 * @class
 * @extends Controller
 * @author Junior Javier Brito Perez
 */
export class RecommendationsController extends Controller {

    #activityView
    #recommendationsRepository
    #surveyRepository

    constructor() {
        super();
        this.#recommendationsRepository = new recommendationsRepository();
        this.#surveyRepository = new SurveyRepository();
        this.#setupView();
    }

    async #setupView() {
        this.#activityView = await super.loadHtmlIntoContent("html_views/selectGoal.html");

        if (await this.#checkSurveysCompleted()) {
            await this.#loadRecommendedGoals();
        }
    }

    /**
     * Loads the recommended goals.
     * @private
     * @async
     * @author Junior Javier Brito Perez
     */
    async #loadRecommendedGoals() {
        const data = await this.#fetchRecommendations();
        const goalTemplate = this.#activityView.querySelector("#goalTemplate").cloneNode(true);

        for (const goal of data) {
            const card = goalTemplate.content.querySelector(".card").cloneNode(true);
            card.querySelector(".card-title").innerText = `${goal.recommendedValue} ${goal.unit} ${goal.name}`;
            card.querySelector(".card-text").innerText = goal.description;
            card.querySelector(".userChosenValueLbl").innerText += goal.unit;
            card.querySelector(".userChosenValue").value = goal.recommendedValue;

            const daysContainer = card.querySelector(".daysContainer");

            card.dataset.id = goal.id;

            card.querySelector(".selectGoal").addEventListener("click", () => {
                if (daysContainer.style.display === "none") {
                    daysContainer.style.display = "flex";
                    card.querySelector(".saveGoal").style.display = "block";
                    card.querySelector(".daysDescriptionContainer").style.display = "block";
                } else {
                    daysContainer.style.display = "none";
                    card.querySelector(".saveGoal").style.display = "none";
                    card.querySelector(".daysDescriptionContainer").style.display = "none";
                }
            });

            card.querySelectorAll(".dayBtn").forEach((dayBtn) => {
                dayBtn.addEventListener("click", () => {
                    dayBtn.classList.toggle("btn-primary");
                });
            });

            card.querySelector(".saveGoal").addEventListener("click", () => {
                const days = this.#retrieveSelectedDays(card);
                if (days.length === 0) {
                    this.#showAlert("Selecteer minstens 1 dag.", false);
                    return;
                }
                if (card.querySelector(".userChosenValue").value === "") {
                    this.#showAlert("Vul een waarde in.", false);
                    return;
                }
                if (card.querySelector(".userChosenValue").value <= 0) {
                    this.#showAlert("Vul een positieve waarde in.", false);
                    return;
                }
                this.#saveGoal(this.#getGoalData(card, days));
                card.remove();
            });

            this.#activityView.querySelector(".templatesContainer").appendChild(card);
        }
    }

    /**
     * Returns an array of goal data for the selected days.
     * @private
     * @param {HTMLElement} card - The card element containing the goal data.
     * @param {Array} days - An array of selected days.
     * @returns {Array} An array of goal data for the selected days.
     * @author Junior Javier Brito Perez
     */
    #getGoalData(card, days) {
        let goals = [];
        for (const day of days) {
            goals.push([
                parseInt(card.dataset.id),
                new Date().toISOString().slice(0, 10).replace('T', ' '),
                parseInt(card.querySelector(".userChosenValue").value),
                parseInt(day)
            ])
        }
        return goals;
    }

    /**
     * Saves a goal to the recommendations repository.
     * @private
     * @async
     * @param {Array} goal - An array containing the goal data to be saved.
     * @returns {boolean} Returns true if the goal was successfully saved.
     * @author Junior Javier Brito Perez
     */
    async #saveGoal(goal) {
        await this.#recommendationsRepository.postGoals(goal);
        this.#showAlert("Success! Uw doel is opgeslagen.", true);
        return true;
    }

    /**
     * Checks if the user has completed the survey and displays an alert if not.
     * @private
     * @async
     * @returns {boolean} Returns true if the user has completed the survey, false otherwise.
     * @author Junior Javier Brito Perez
     */
    async #checkSurveysCompleted() {
        const surveyStatus = await this.#surveyRepository.getSurveyStatus();
        if (surveyStatus.survey_status !== 1) {
            this.#showAlert(
                "U heeft nog geen vragenlijst ingevuld. Ga naar de vragenlijst om deze in te vullen.",
                false);
            this.#activityView.querySelector(".templatesContainer").style.display = "none";
            return false;
        }
        return true;
    }

    /**
     * Retrieves the selected days from the given card element.
     * @private
     * @param {HTMLElement} card - The card element containing the selected days.
     * @returns {Array} An array of selected days.
     * @author Junior Javier Brito Perez
     */
    #retrieveSelectedDays(card) {
        const days = [];
        card.querySelectorAll(".dayBtn").forEach((dayBtn) => {
            if (dayBtn.classList.contains("btn-primary")) {
                days.push(dayBtn.id);
            }
        });
        return days;
    }

    /**
     * Shows an alert message on the view.
     * @private
     * @param {string} message - The message to display in the alert.
     * @param succes - True if the alert is a success alert, false otherwise.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    #showAlert(message, succes) {
        const alert = this.#activityView.querySelector("#alert").content.cloneNode(true);
        if (succes) {
            alert.querySelector(".alert").classList.add("alert-success");
        } else {
            alert.querySelector(".alert").classList.add("alert-danger");
        }
        alert.querySelector(".alert-text").innerText = message;
        this.#activityView.querySelector(".alert-container").appendChild(alert);
    }

    /**
     * Fetches exercise and nutrition recommendations from the recommendations repository.
     * @private
     * @async
     * @returns {Array} An array of exercise and nutrition recommendations.
     * @author Junior Javier Brito Perezer
     */
    async #fetchRecommendations() {
        const exercise = await this.#recommendationsRepository.getExerciseRecommendations();
        const nutrition = await this.#recommendationsRepository.getNutritionRecommendations();
        return exercise.concat(nutrition);
    }
}