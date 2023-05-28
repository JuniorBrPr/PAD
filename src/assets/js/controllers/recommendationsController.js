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

            const daysContainer = card.querySelector(".daysContainer");

            card.dataset.id = goal.id;
            card.dataset.chosenValue = goal.recommendedValue;

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
                    alert("Geen dagen geselecteerd!");
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
                parseInt(card.dataset.chosenValue),
                parseInt(day)
            ])
        }
        return goals;
    }

    async #saveGoal(goal) {
        await this.#recommendationsRepository.postGoals(goal);
        alert("Doel opgeslagen!");
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

    async #fetchRecommendations() {
        const exercise = await this.#recommendationsRepository.getExerciseRecommendations();
        const nutrition = await this.#recommendationsRepository.getNutritionRecommendations();
        return exercise.concat(nutrition);
    }
}