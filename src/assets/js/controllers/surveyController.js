import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";

/**
 * Responsible for handling the actions happening on the survey view.
 *
 * @class SurveyController
 * @classdesc Handles the actions happening on the survey view.
 * @property {SurveyRepository} #surveyRepository - The repository for survey related requests.
 * @property {ActivityFrequencyRepository} #frequencyRepository - The repository for activity frequency related
 * requests.
 * @property {HTMLElement} #surveyView - The HTML element containing the survey view.
 * @property {number} #currentQuestion - The index of the current question.
 * @property {number} #questionsAnswered - The number of questions answered.
 * @property {[Object]} #data - The data of the survey.
 * @property {HTMLElement} #CONTAINER - The HTML element containing the survey questions.
 * @property {HTMLElement} #QUESTION_TEMPLATE - The HTML element containing the template for a question.
 * @property {HTMLElement} #CHECKBOX_OPTION - The HTML element containing the template for a checkbox option.
 * @property {HTMLElement} #CHECKBOX_FIELD_OPTION - The HTML element containing the template for a checkbox field
 * option.
 * @property {HTMLElement} #RADIO_OPTION - The HTML element containing the template for a radio option.
 * @author Junior Javier Brito Perez
 */
export class SurveyController extends Controller {
    #surveyRepository
    #surveyView
    #currentQuestion
    #questionsAnswered
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
        this.#questionsAnswered = 0;
        this.#data = [];

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div.
     * @async
     * @private
     * @author Junior Javier Brito Perez
     */
    async #setupView() {
        this.#surveyView = await super.loadHtmlIntoContent("html_views/survey.html");
        this.#surveyView.querySelector(".survey-form").style.display = "none";

        const nutritionSurveyBtn = this.#surveyView.querySelector("#voeding-survey-btn");
        const exerciseSurveyBtn = this.#surveyView.querySelector("#beweging-survey-btn");

        const unansweredSurveys = await this.#fetchUnansweredSurveys();

        if (unansweredSurveys.length === 0) {
            await this.#surveyRepository.setSurveyComplete(App.sessionManager.get('user_id'));
            App.loadController("welcome");
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

            //TODO: Remove hardcoded userId
            window.addEventListener("beforeunload", async (e) => {
                if (this.#questionsAnswered !== 0) {
                    e.preventDefault();
                    await this.#surveyRepository.putSurveyResult(this.#getSurveyResponseData(false), 1);
                    window.removeEventListener("beforeunload", () => {
                    });
                }
            });

            //TODO: Remove hardcoded userId
            window.addEventListener("click", async (e) => {
                if (e.target.classList.contains("nav-link")) {
                    await this.#surveyRepository.putSurveyResult(this.#getSurveyResponseData(false), 1);
                    window.removeEventListener("click", () => {
                    });
                }
            });

            nutritionSurveyBtn.addEventListener("click", () => {
                this.#fetchSurvey(1);
                this.#surveyView.querySelector(".survey-welcome").style.display = "none";
            });

            this.#surveyView.querySelector("#beweging-survey-btn")
                .addEventListener("click", () => {
                    this.#fetchSurvey(2);
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
     * @async
     * @private
     * @returns {Promise<void>}
     * @author Junior Javier Brito Perez
     */
    async #fetchSurvey(surveyId) {
        // TODO: Replace hardcoded id with actual id or remove id parameter.
        // TODO: Remove filter, just for testing purposes.
        this.#data = await this.#surveyRepository.getQuestions(1, surveyId)

        this.#displayQuestions();
        this.#surveyView.querySelector(".survey-form").style.display = "block";
        this.#loadPercentage();
    }

    /**
     * Displays the questions on the survey view.
     * @private
     * @author Junior Javier Brito Perez
     */
    #displayQuestions() {
        for (let i = 0; i < this.#data.length; i++) {
            const question = this.#data[i];
            const questionTab = this.#QUESTION_TEMPLATE.content.querySelector(".questionTab").cloneNode(true);
            questionTab.style.display = "none";
            questionTab.querySelector(".questionText").innerText =
                `(${i + 1}/${this.#data.length}) ${question.text}`;
            questionTab.querySelector(".alert").style.display = "none";
            const optionsContainer = questionTab.querySelector(".options-container");

            if (question.hasOwnProperty("options") && question.options.length > 0) {
                for (let j = 0; j < question.options.length; j++) {
                    const option = question.options[j].open === 0 ?
                        this.#CHECKBOX_OPTION.content.querySelector(".option").cloneNode(true) :
                        this.#CHECKBOX_FIELD_OPTION.content.querySelector(".option").cloneNode(true);
                    option.querySelector(".optionText").innerText = question.options[j].text;
                    optionsContainer.appendChild(option);
                }
            } else if (question.hasOwnProperty("type")) {
                switch (question.type) {
                    case "numberScale":
                    case "portion":
                    case "weeklyPortions":
                        const option = this.#RADIO_OPTION.content.querySelector(".option")
                            .cloneNode(true);
                        const radioBtnContainer = option.querySelector(".radio-button-container");
                        console.log(question);
                        switch (question.type) {
                            case "numberScale":
                                for (let j = 0; j < 8; j++) {
                                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                                        .cloneNode(true);
                                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ?
                                        "Nooit" : j === 7 ?
                                            "Elke dag" : String(j);
                                    radioBtnContainer.appendChild(radioBtn);
                                }
                                optionsContainer.appendChild(option);
                                break;
                            case "weeklyPortions" :
                                const daysLbl = document.createElement("h4");
                                daysLbl.classList.add("text-center");
                                daysLbl.innerText = "Hoeveel dagen?";

                                const portionsLbl = document.createElement("h4");
                                portionsLbl.innerText = "Hoeveel porties per dag?";
                                portionsLbl.classList.add("text-center");

                                for (let j = 0; j < 8; j++) {
                                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                                        .cloneNode(true);
                                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ?
                                        "Nooit" : j === 7 ?
                                            "Elke dag" : String(j);
                                    if (j === 0) {
                                        radioBtn.querySelector("#radioBtn").addEventListener("click", () => {
                                            portionOption.style.display = "none";
                                            portionsLbl.style.display = "none";
                                        });
                                    } else {
                                        radioBtn.querySelector("#radioBtn").addEventListener("click", () => {
                                            portionOption.style.display = "block";
                                            portionsLbl.style.display = "block";
                                        });
                                    }
                                    radioBtnContainer.appendChild(radioBtn);
                                }

                                const portionOption = this.#RADIO_OPTION.content.querySelector(".option")
                                    .cloneNode(true);
                                const portionBtnContainer = portionOption.querySelector(".radio-button-container");

                                for (let j = 1; j <= 8; j++) {
                                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                                        .cloneNode(true);
                                    radioBtn.querySelector("#radioBtn").name = "p";
                                    radioBtn.querySelector(".form-check-label").innerText = j === 8 ?
                                        "Meer dan 7" : String(j);
                                    portionBtnContainer.appendChild(radioBtn);
                                }

                                portionOption.style.display = "none";
                                portionsLbl.style.display = "none";
                                optionsContainer.appendChild(daysLbl);
                                optionsContainer.appendChild(option);
                                optionsContainer.appendChild(portionsLbl);
                                optionsContainer.appendChild(portionOption)
                                break;
                            case "portion":
                                for (let j = 1; j <= 8; j++) {
                                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                                        .cloneNode(true);
                                    radioBtn.querySelector(".form-check-label").innerText = String(j);
                                    optionsContainer.appendChild(radioBtn);
                                }
                                // optionsContainer.appendChild(option);
                                break;
                        }
                        break;
                }
            }
            this.#CONTAINER.appendChild(questionTab);
        }
    }

    /**
     * Loads the progress bar percentage.
     * @private
     * @author Junior Javier Brito Perez
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
     * @author Junior Javier Brito Perez
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
     * @author Junior Javier Brito Perez
     */
    async #nextPrev(nextTabNumber) {
        let questionTabs = this.#surveyView.getElementsByClassName("questionTab");

        if (nextTabNumber === 1 && !this.#validateForm()) {
            return false
        }

        questionTabs[this.#currentQuestion].style.display = "none";
        this.#currentQuestion = this.#currentQuestion + nextTabNumber;
        this.#questionsAnswered = this.#currentQuestion > this.#questionsAnswered ?
            this.#currentQuestion : this.#questionsAnswered;

        if (this.#currentQuestion >= questionTabs.length) {
            // TODO: remove hardcoded user id
            const response = await this.#surveyRepository.putSurveyResult(
                this.#getSurveyResponseData(this.#data[0].surveyId !== 2), 1);
            await this.#setupView();
            const alert = this.#surveyView.querySelector(".alert");
            alert.style.display = "block";
            if (response.failure) {
                alert.classList.add("alert-danger");
                alert.classList.remove("alert-success");
            }
            alert.innerText = response.message;

            this.#surveyView.querySelector(".questionContainer").innerHTML = "";
            this.#questionsAnswered = 0;
            return false;
        }
        this.#showTab();
    }

    /**
     * Validates the form of the current question.
     * @private
     * @returns {boolean} true if the form is valid.
     * @author Junior Javier Brito Perez
     */
    #validateForm() {
        let questionTabs = this.#surveyView.getElementsByClassName("questionTab");
        const alert = this.#currentQuestion < questionTabs.length ? questionTabs[this.#currentQuestion].querySelector(".alert") : null;
        let optionsCurrentQuestionTab = questionTabs[this.#currentQuestion].querySelectorAll(".option");
        let optionsCurrentQuestionTabRadio = questionTabs[this.#currentQuestion].querySelectorAll(".formRadioBtn");
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
            case "frequency":
                optionsCurrentQuestionTabRadio = questionTabs[this.#currentQuestion].querySelectorAll("#radioBtn");
                const labelFrequency = questionTabs[this.#currentQuestion].querySelectorAll(".option-text");
                for (let i = 0; i < optionsCurrentQuestionTabRadio.length; i++) {
                    if (optionsCurrentQuestionTabRadio[i].checked) {
                        console.log(labelFrequency[i].innerText);
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    alert.innerText = "Gelieve een antwoord te selecteren.";
                }
                break;
            case "yesNo":
                optionsCurrentQuestionTabRadio = questionTabs[this.#currentQuestion].querySelectorAll("#radioBtn");
                const labelYesNo = questionTabs[this.#currentQuestion].querySelectorAll(".option-text");
                for (let i = 0; i < optionsCurrentQuestionTabRadio.length; i++) {
                    if (optionsCurrentQuestionTabRadio[i].checked) {
                        console.log(labelYesNo[i].innerText);
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    alert.innerText = "Gelieve een antwoord te selecteren.";
                }
                break;
            case "time":
                optionsCurrentQuestionTabRadio = questionTabs[this.#currentQuestion].querySelectorAll("#radioBtn");
                const labelTime = questionTabs[this.#currentQuestion].querySelectorAll(".option-text");
                for (let i = 0; i < optionsCurrentQuestionTabRadio.length; i++) {
                    if (optionsCurrentQuestionTabRadio[i].checked) {
                        console.log(labelTime[i].innerText);
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    alert.innerText = "Gelieve een antwoord te selecteren.";
                }
                break;
            case "effort":
                optionsCurrentQuestionTabRadio = questionTabs[this.#currentQuestion].querySelectorAll("#radioBtn");
                const labelEffort = questionTabs[this.#currentQuestion].querySelectorAll(".option-text");
                for (let i = 0; i < optionsCurrentQuestionTabRadio.length; i++) {
                    if (optionsCurrentQuestionTabRadio[i].checked) {
                        console.log(labelEffort[i].innerText);
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    alert.innerText = "Gelieve een antwoord te selecteren.";
                }
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
     * @param completed {boolean} true if the user has answered all the questions in the current survey.
     * @returns {[Object]} An array of objects containing the survey response data.
     * @todo Implement data collection for all types of questions.
     * @author Junior Javier Brito Perez.
     */
    #getSurveyResponseData(completed) {
        //TODO: Implement data collection for all types of questions.
        let responseData;
        const surveyData = [];
        const range = completed ? this.#data.length : this.#questionsAnswered;

        for (let i = 0; i < range; i++) {
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

