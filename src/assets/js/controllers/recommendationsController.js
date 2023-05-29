/**
 * Controller responsible for all events in activity view
 * @author Jayden.G
 */

import {Controller} from "./controller.js";
import {recommendationsRepository} from "../repositories/recommendationsRepository.js";

export class RecommendationsController extends Controller {

    #activityView
    #recommendationsRepository

    constructor() {
        super();
        this.#recommendationsRepository = new recommendationsRepository();
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

        await this.#loadRecommendedGoals();
    }

    async #loadRecommendedGoals() {
        const data = await this.#fetchRecommendations();
        const goalTemplate = this.#activityView.querySelector("#goalTemplate").cloneNode(true);

        console.log(data);
        for (const goal of data) {
            console.log(goal);
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

    #getGoalData(card, days){
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

    async #saveGoal(goal) {
        await this.#recommendationsRepository.postGoals(goal);
        this.#showAlert("Success! Uw doel is opgeslagen.", true);
        return true;
    }

    #retrieveSelectedDays(card) {
        const days = [];
        card.querySelectorAll(".dayBtn").forEach((dayBtn) => {
            if (dayBtn.classList.contains("btn-primary")) {
                days.push(dayBtn.id);
            }
        });
        return days;
    }

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

    async #fetchRecommendations() {
        const exercise = await this.#recommendationsRepository.getExerciseRecommendations();
        const nutrition = await this.#recommendationsRepository.getNutritionRecommendations();
        return exercise.concat(nutrition);
    }
}