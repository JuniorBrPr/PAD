import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";

/**
 * Responsible for handling the actions happening on the survey view.
 *
 * @author Junior Javier Brito Perez
 */
export class SurveyController extends Controller {
    #surveyRepository
    #surveyView
    #currentQuestion
    #data

    #CONTAINER;
    #QUESTION_TEMPLATE;
    #CHECKBOX_OPTION;
    #CHECKBOX_FIELD_OPTION;
    #RADIO_OPTION;
    #RADIO_BUTTON;

    constructor() {
        super();
        this.#surveyRepository = new SurveyRepository();
        this.#currentQuestion = 0;
        this.#data = [];

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        this.#surveyView = await super.loadHtmlIntoContent("html_views/survey.html");
        this.#surveyView.querySelector(".survey-form").style.display = "none";

        const nutritionSurveyBtn = this.#surveyView.querySelector("#voeding-survey-btn");
        const exerciseSurveyBtn = this.#surveyView.querySelector("#beweging-survey-btn");

        const unansweredSurveys = await this.#fetchUnansweredSurveys();

        if (unansweredSurveys.length === 0) {
            //TODO: Redirect to dashboard
        } else {
            for (const survey of unansweredSurveys) {
                switch (survey.id) {
                    case 1:
                        nutritionSurveyBtn.classList.remove("disabled");
                        break;
                    case 2:
                        exerciseSurveyBtn.classList.remove("disabled");
                        break;
                }
            }

            nutritionSurveyBtn.addEventListener("click", () => {
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

            this.#CONTAINER = this.#surveyView.querySelector(".questionContainer");
            this.#QUESTION_TEMPLATE = this.#surveyView.querySelector("#questionTemplate").cloneNode(true);
            this.#CHECKBOX_OPTION = this.#surveyView.querySelector("#checkbox").cloneNode(true);
            this.#CHECKBOX_FIELD_OPTION = this.#surveyView.querySelector("#checkboxWithField").cloneNode(true);
            this.#RADIO_OPTION = this.#surveyView.querySelector("#radio").cloneNode(true);
            this.#RADIO_BUTTON = this.#surveyView.querySelector("#radioButton").cloneNode(true);

            this.#surveyView.querySelector(".alert").style.display = "none";
        }
    }

    async #fetchUnansweredSurveys() {
        //TODO: Replace hardcoded id with actual id or remove id parameter.
        return await this.#surveyRepository.getUnansweredSurveys(1);
    }

    /**
     * Fetches the nutrition survey from the database.
     * @returns {Promise<void>}
     */
    async #fetchNutritionSurvey() {
        //TODO: Replace hardcoded id with actual id or remove id parameter.
        this.#data = await this.#surveyRepository.getNutritionSurvey(1);
        this.#displayQuestions();
        this.#surveyView.querySelector(".survey-form").style.display = "block";
        this.#loadPercentage();
    }

    /**
     * Displays the questions on the survey view.
     * @private
     */
    #displayQuestions() {
        for (let i = 0; i < this.#data.length; i++) {
            const question = this.#data[i];
            const questionTab = this.#QUESTION_TEMPLATE.content.querySelector(".questionTab").cloneNode(true);
            questionTab.style.display = "none";
            questionTab.querySelector(".questionText").innerText = question.text;
            questionTab.querySelector(".alert").style.display = "none";
            const optionsContainer = questionTab.querySelector(".options-container");

            // @todo: move to separate function, refactor
            if (question.hasOwnProperty("options")) {
                for (let j = 0; j < question.options.length; j++) {
                    if (question.options[j].open === 0) {
                        const option = this.#CHECKBOX_OPTION.content.querySelector(".option").cloneNode(true);
                        option.querySelector(".optionText").innerText = question.options[j].text;
                        optionsContainer.appendChild(option);
                    } else if (question.options[j].open === 1) {
                        const option = this.#CHECKBOX_FIELD_OPTION.content.querySelector(".option")
                            .cloneNode(true);
                        option.querySelector(".optionText").innerText = question.options[j].text;
                        optionsContainer.appendChild(option);
                    }
                }
            } else if (question.type === "numberScale") {
                const option = this.#RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 0; j < 8; j++) {
                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ? "Nooit" : j === 7 ? "Elke dag" : String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            } else if (question.type === "portion") {
                const option = this.#RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 1; j <= 8; j++) {
                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            }
            this.#CONTAINER.appendChild(questionTab);
        }
        this.#showTab(this.#currentQuestion);
    }

    /**
     * Loads the progress bar percentage.
     * @private
     */
    #loadPercentage() {
        let x = this.#surveyView.getElementsByClassName("questionTab").length;
        let percentage = this.#currentQuestion === 0 ?
            0 : Math.round((this.#currentQuestion) / x * 100);
        this.#surveyView.querySelector(".progress-bar").style.width = percentage >= 1 ?
            percentage + "%" : "fit-content";
        this.#surveyView.querySelector(".progress-bar").innerText = percentage + "%";
    }

    /**
     * Shows the current question.
     * @private
     */
    #showTab() {
        const questionTabs = this.#surveyView.getElementsByClassName("questionTab");
        questionTabs[this.#currentQuestion].style.display = "block";

        if (this.#currentQuestion === 0) {
            this.#surveyView.querySelector(".prev").style.display = "none";
        } else {
            this.#surveyView.querySelector(".prev").style.display = "block";
        }

        if (this.#currentQuestion === (questionTabs.length - 1)) {
            this.#surveyView.querySelector(".next").innerText = "Bevestigen";
        } else {
            this.#surveyView.querySelector(".next").innerText = "Volgende";
        }
    }

    /**
     * Allows the user to go to the next or previous question. If the user is on the last question,
     * the survey is submitted.
     * @private
     * @param {number} nextTabNumber -1 for previous question, 1 for next question.
     * @returns {Promise<boolean>} true if the user is on the last question.
     */
    async #nextPrev(nextTabNumber) {
        let questionTabs = this.#surveyView.getElementsByClassName("questionTab");

        if (nextTabNumber === 1 && !this.#validateForm()) {
            return false
        }

        questionTabs[this.#currentQuestion].style.display = "none";
        this.#currentQuestion = this.#currentQuestion + nextTabNumber;

        if (this.#currentQuestion >= questionTabs.length) {
            // TODO: remove hardcoded user id
            const response = await this.#surveyRepository.putSurveyResult(this.#getSurveyResponseData(), 1);
            await this.#setupView();
            const alert = this.#surveyView.querySelector(".alert");
            alert.style.display = "block";
            if (response.failure) {
                alert.classList.add("alert-danger");
                alert.classList.remove("alert-success");
            }
            alert.innerText = response.message;

            this.#surveyView.querySelector(".questionContainer").innerHTML = "";
            return false;
        }
        this.#showTab(this.#currentQuestion);
    }

    /**
     * Validates the form of the current question.
     * @private
     * @returns {boolean} true if the form is valid.
     */
    #validateForm() {
        let questionTabs = this.#surveyView.getElementsByClassName("questionTab");
        const alert = questionTabs[this.#currentQuestion].querySelector(".alert");
        let optionsCurrentQuestionTab = questionTabs[this.#currentQuestion].querySelectorAll(".option");
        const currentQuestionObj = this.#data[this.#currentQuestion];
        let valid = false;
        let checked = 0;

        switch (currentQuestionObj.type) {
            case "singleChoice":
                for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
                    if (checked > 1) break;
                    if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
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
                break;
            case "portion":
            case "numberScale" :
                optionsCurrentQuestionTab = questionTabs[this.#currentQuestion].querySelectorAll("#radioBtn");
                const labels = questionTabs[this.#currentQuestion].querySelectorAll(".option-text");
                for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
                    if (optionsCurrentQuestionTab[i].checked) {
                        //TODO: Don't remove this console.log for now, it's used to get the correct answer.
                        // Will be removed later.
                        console.log(labels[i].innerText);
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    alert.innerText = "Gelieve een antwoord te selecteren.";
                }
                break;
            case "multipleChoice":
                checked = 0;
                for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
                    if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
                        valid = true;
                        break;
                    } else {
                        alert.innerText = "Gelieve een antwoord te selecteren.";
                    }
                }
                break;
            //TODO: Implement validation weeklyPortions and title.
            case "weeklyPortions":
            case "title":
                valid = true;
                break;
            default:
                valid = false;
                break;
        }

        if (!valid) {
            alert.style.display = valid ? "none" : "block";
        } else {
            questionTabs[this.#currentQuestion].querySelector(".alert").style.display = "none";
        }
        return valid;
    }

    /**
     * Gets the survey response data.
     * @private
     * @returns {{surveyId: number, data: [{id: number, options: [{text: string, open: boolean}] }] }}
     */
    #getSurveyResponseData() {
        //TODO: Implement data collection for all types of questions.
        let responseData;
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
                    let open = false;
                    if (question.hasOwnProperty("options")) {
                        open = question.options[j].open;
                        text = question.options[j].text + (open ?
                            " " + option.querySelector(".input-field").value : "");
                    } else if (question.type === "numberScale") {
                        text = option.querySelector(".optionText").innerText;
                    }

                    const optionObj = {
                        optionId: question.type === "numberScale" ? null : question.options[j].id,
                        text: text,
                        open: open
                    };
                    questionObj.options.push(optionObj);
                }
            }

            surveyData.push(questionObj);
        }

        responseData = {
            surveyId: this.#data[0].surveyId,
            data: surveyData,
        };

        return responseData;
    }
}
