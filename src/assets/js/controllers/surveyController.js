import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";

export class SurveyController extends Controller {
    #surveyRepository
    #surveyView
    #currentQuestion

    constructor() {
        super();
        this.#surveyRepository = new SurveyRepository();
        this.#currentQuestion = 0;

        this.#setupView();
    }

    async #setupView() {
        this.#surveyView = await super.loadHtmlIntoContent("html_views/survey.html");
        this.#surveyView.querySelector(".survey-form").style.display = "none";

        this.#surveyView.querySelector("#voeding-survey-btn")
            .addEventListener("click", () => {
                this.#fetchNutritionSurvey();
                this.#surveyView.querySelector(".survey-welcome").style.display = "none";
            });

        this.#surveyView.querySelector(".next").addEventListener("click", () => {
            this.#nextPrev(1);
            this.#loadPercentage();
        });
        this.#surveyView.querySelector(".prev").addEventListener("click", () => {
            this.#nextPrev(-1);
            this.#loadPercentage();
        });

        this.#surveyView.querySelector(".alert").style.display = "none";
    }

    async #fetchNutritionSurvey() {
        this.#displayQuestions(await this.#surveyRepository.getNutritionSurvey());
        this.#surveyView.querySelector(".survey-form").style.display = "block";
        this.#loadPercentage();
    }

    #displayQuestions(data) {
        const container = this.#surveyView.querySelector(".questionContainer");
        const questionTemplate = this.#surveyView.querySelector("#questionTemplate").cloneNode(true);
        const checkboxOption = this.#surveyView.querySelector("#checkbox").cloneNode(true);
        const checkboxFieldOption = this.#surveyView.querySelector("#checkboxWithField").cloneNode(true);


        for (let i = 0; i < data.length; i++) {
            const question = data[i];
            const questionTab = questionTemplate.content.querySelector(".questionTab").cloneNode(true);
            questionTab.style.display = "none";
            questionTab.querySelector(".questionText").innerText = question.text;

            const optionsContainer = questionTab.querySelector(".options-container");
            for (let j = 0; j < question.options.length; j++) {
                if (question.options[j].open === 0) {
                    const option = checkboxOption.content.querySelector(".option").cloneNode(true);
                    option.querySelector(".optionText").innerText = question.options[j].text;
                    optionsContainer.appendChild(option);
                } else if (question.options[j].open === 1) {
                    const option = checkboxFieldOption.content.querySelector(".option").cloneNode(true);
                    option.querySelector(".optionText").innerText = question.options[j].text;
                    optionsContainer.appendChild(option);
                }
            }

            container.appendChild(questionTab);
        }

        this.#showTab(this.#currentQuestion);
    }

    #loadPercentage() {
        let x = this.#surveyView.getElementsByClassName("questionTab").length;
        let percentage = this.#currentQuestion === 0 ? 0 : Math.round((this.#currentQuestion) / x * 100);
        this.#surveyView.querySelector(".progress-bar").style.width = percentage >= 1 ? percentage + "%" : "fit-content";
        this.#surveyView.querySelector(".progress-bar").innerText = percentage + "%";
    }

    #showTab(n) {
        let x = this.#surveyView.getElementsByClassName("questionTab");
        x[n].style.display = "block";
        if (n === 0) {
            this.#surveyView.querySelector(".prev").style.display = "none";
        } else {
            this.#surveyView.querySelector(".prev").style.display = "block";
        }
        if (n === (x.length - 1)) {
            this.#surveyView.querySelector(".next").innerText = "Bevestigen";
        } else {
            this.#surveyView.querySelector(".next").innerText = "Volgende";
        }
    }

    async #nextPrev(n) {
        let x = this.#surveyView.getElementsByClassName("questionTab");
        if (n === 1 && !this.#validateForm()) return false;
        x[this.#currentQuestion].style.display = "none";
        this.#currentQuestion = this.#currentQuestion + n;
        if (this.#currentQuestion >= x.length) {
            this.#surveyView.querySelector(".survey-form").style.display = "none";
            this.#surveyView.querySelector(".survey-welcome").style.display = "block";
            this.#surveyView.querySelector(".alert").style.display = "block";
            this.#surveyView.querySelector("#voeding-survey-btn").classList.add("disabled");
            this.#surveyView.querySelector(".questionContainer").innerHTML = "";
            return false;
        }
        this.#showTab(this.#currentQuestion);
    }

    #validateForm() {
        // @todo: validate form
        return true;
    }
}
