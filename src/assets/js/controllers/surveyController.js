import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";

export class SurveyController extends Controller {
    #surveyRepository
    #surveyView

    constructor() {
        super();
        this.#surveyRepository = new SurveyRepository();

        this.#setupView();
    }

    async #setupView() {
        this.#surveyView = await super.loadHtmlIntoContent("html_views/survey.html");

        this.#surveyView.querySelector("#voeding-survey-btn")
            .addEventListener("click", () => this.#fetchNutritionSurvey());
    }

    async #fetchNutritionSurvey() {
        this.#displayQuestions(await this.#surveyRepository.getNutritionSurvey());
    }

    // TODO: Remove this method
    #displayQuestions(data) {
        const container = this.#surveyView.querySelector(".survey-form");

        for (let i = 0; i < data.length; i++) {
            const question = data[i];
            const questionDiv = document.createElement("div")
            questionDiv.classList.add("question")
            questionDiv.innerText = question.questionText;
            container.appendChild(questionDiv)
            for (let j = 0; j < question.options.length; j++) {
                const option = question.options[j].questionOptionText;
                const optionDiv = document.createElement("div")
                optionDiv.classList.add("option")
                optionDiv.innerText = option
                questionDiv.appendChild(optionDiv)
            }
        }
    }
}
