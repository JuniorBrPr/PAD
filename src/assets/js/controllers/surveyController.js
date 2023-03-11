import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";

export class SurveyController extends Controller {
    #surveyRepository
    #surveyView
    #currentQuestion
    #data

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
        this.#data = await this.#surveyRepository.getNutritionSurvey();
        this.#displayQuestions();
        this.#surveyView.querySelector(".survey-form").style.display = "block";
        this.#loadPercentage();
    }

    #displayQuestions() {
        const container = this.#surveyView.querySelector(".questionContainer");
        const questionTemplate = this.#surveyView.querySelector("#questionTemplate").cloneNode(true);
        const checkboxOption = this.#surveyView.querySelector("#checkbox").cloneNode(true);
        const checkboxFieldOption = this.#surveyView.querySelector("#checkboxWithField").cloneNode(true);

        for (let i = 0; i < this.#data.length; i++) {
            const question = this.#data[i];
            const questionTab = questionTemplate.content.querySelector(".questionTab").cloneNode(true);
            questionTab.style.display = "none";
            questionTab.querySelector(".questionText").innerText = question.text;
            questionTab.querySelector(".alert").style.display = "none";
            const optionsContainer = questionTab.querySelector(".options-container");

            // @todo: move to separate function
            if (question.hasOwnProperty("options")) {
                for (let j = 0; j < question.options.length; j++) {
                    if (question.options[j].open === 0) {
                        const option = checkboxOption.content.querySelector(".option").cloneNode(true);
                        option.querySelector(".optionText").innerText = question.options[j].text;
                        optionsContainer.appendChild(option);
                    } else if (question.options[j].open === 1) {
                        const option = checkboxFieldOption.content.querySelector(".option")
                            .cloneNode(true);
                        option.querySelector(".optionText").innerText = question.options[j].text;
                        optionsContainer.appendChild(option);
                    }
                }
            } else if (question.type === "numberScale") {
                for (let j = 0; j < 8; j++) {
                    const option = checkboxOption.content.querySelector(".option").cloneNode(true);
                    option.querySelector(".optionText").innerText = j === 0 ? "Nooit" : j === 7 ? "Elke dag" : String(j);
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
            await this.#surveyRepository.putSurveyResult(this.#getSurveyData(), 1);
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
        let x = this.#surveyView.getElementsByClassName("questionTab");
        const alert = x[this.#currentQuestion].querySelector(".alert");

        let y = x[this.#currentQuestion].querySelectorAll(".option");
        const currentQuestionObj = this.#data[this.#currentQuestion];
        let valid = false;

        if (currentQuestionObj.type === "singleChoice" || currentQuestionObj.type === "numberScale") {
            let checked = 0;
            for (let i = 0; i < y.length; i++) {
                if (checked > 1) break;
                if (y[i].querySelector("input").checked) {
                    checked++;
                }
            }
            if (checked === 1) {
                valid = true;
            } else if (checked > 1) {
                alert.innerText = "Gelieve slechts 1 antwoord te selecteren.";
            } else {
                alert.innerText = "Gelieve een antwoord te selecteren.";
            }
        } else if (currentQuestionObj.type === "multipleChoice") {
            for (let i = 0; i < y.length; i++) {
                if (y[i].querySelector("input").checked) {
                    valid = true;
                    break;
                } else {
                    alert.innerText = "Gelieve een antwoord te selecteren.";
                }
            }
        }

        if (!valid) {
            const alert = x[this.#currentQuestion].querySelector(".alert");
            alert.style.display = "block";
        } else {
            x[this.#currentQuestion].querySelector(".alert").style.display = "none";
        }
        return valid;
    }

    #getSurveyData() {
        const surveyData = [];
        for (let i = 0; i < this.#data.length; i++) {
            const question = this.#data[i];
            const questionObj = {
                id: question.id,
                options: []
            };

            const options = this.#surveyView.querySelectorAll(".questionTab")[i].querySelectorAll(".option");

            for (let j = 0; j < options.length; j++) {
                if (options[j].querySelector("input").checked) {
                    const option = options[j];

                    let text;
                    if (question.hasOwnProperty("options")){
                        text = question.options[j].text + (question.options[j].open ?
                            " " + option.querySelector(".input-field").value : "");
                    } else if (question.type === "numberScale") {
                        text = option.querySelector(".optionText").innerText;
                    }

                    const optionObj = {
                        optionId: question.type === "numberScale" ? null : question.options[j].id,
                        text: text
                    };
                    questionObj.options.push(optionObj);
                }
            }

            surveyData.push(questionObj);
        }

        return {
            surveyId: this.#data[0].surveyId,
            data: surveyData,
        };
    }
}
