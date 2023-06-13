import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";
import {App} from "../app.js";
import {Validation} from "../framework/utils/validation.js";

/**
 * Responsible for handling the actions happening on the survey view.
 *
 * @author Junior Javier Brito Perez
 */
export class SurveyController extends Controller {
    #surveyRepository
    #surveyView
    #currentQuestion
    #questionsAnswered
    #validation
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
        this.#validation = new Validation();

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
            await this.#surveyRepository.setSurveyComplete(App.sessionManager.get('user_id'));
            App.loadController("welcome", {});
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

            window.addEventListener("beforeunload", async (e) => {
                if (this.#questionsAnswered !== 0) {
                    e.preventDefault();
                    await this.#surveyRepository.putSurveyResult(this.#getAllAnswers().length !== 0 ? this.#getAllAnswers() : {});
                    window.removeEventListener("beforeunload", () => {
                    });
                }
            });

            window.addEventListener("click", async (e) => {
                if (e.target.classList.contains("nav-link")) {
                    await this.#surveyRepository.putSurveyResult(this.#getAllAnswers().length !== 0 ? this.#getAllAnswers() : {});
                    window.removeEventListener("click", () => {
                    });
                }
            });

            nutritionSurveyBtn.addEventListener("click", async () => {
                await this.#fetchQuestions(1);
                this.#currentQuestion = 0;
                this.#showTab(this.#currentQuestion)
            });

            exerciseSurveyBtn.addEventListener("click", async () => {
                await this.#fetchQuestions(2);
                this.#currentQuestion = 0;
                this.#showTab(this.#currentQuestion)
            });

            this.#surveyView.querySelector(".next").addEventListener("click", () => {
                this.#nextPrev(1);
            });

            this.#surveyView.querySelector(".prev").addEventListener("click", () => {
                this.#nextPrev(-1);
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

    /**
     * Fetches the unanswered surveys from the survey repository.
     * @private
     * @returns {Promise<Array>} An array of unanswered surveys.
     * @author Junior Javier Brito Perez
     */
    async #fetchUnansweredSurveys() {
        return await this.#surveyRepository.getUnansweredSurveys();
    }

    /**
     * Fetches the questions for a given survey from the survey repository.
     * @private
     * @param {number} surveyId - The ID of the survey to fetch questions for.
     * @returns {Promise<void>}
     * @author Junior Javier Brito Perez
     */
    async #fetchQuestions(surveyId) {
        this.#data = await this.#surveyRepository.getQuestions(surveyId)
    }

    /**
     * Fetches the options for a given question from the survey repository.
     * @private
     * @param {number} questionId - The ID of the question to fetch options for.
     * @returns {Promise<Array>} An array of options for the given question.
     * @author Junior Javier Brito Perez
     */
    async #fetchOptions(questionId) {
        return await this.#surveyRepository.getOptions(questionId);
    }

    /**
     * Displays the question at the given index on the survey view.
     * Hides the welcome message and shows the survey form.
     * Calls the appropriate method to display the question based on the survey type.
     * Updates the percentage of questions answered.
     *
     * @private
     * @param {number} index - The index of the question to display.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    #displayQuestion(index) {
        this.#surveyView.querySelector(".survey-welcome").style.display = "none";
        this.#surveyView.querySelector(".survey-form").style.display = "block";
        this.#CONTAINER.innerHTML = "";

        if (this.#data.length > 0 && this.#data[0].surveyId === 1) {
            this.#displayNutritionSurvey(index);
        } else if (this.#data.length > 0 && this.#data[0].surveyId === 2) {
            this.#displayExerciseSurvey(index);
        }

        this.#loadPercentage();
    }

    /**
     * Displays the exercise survey questions on the survey view.
     * Determines the appropriate template to use based on the type of exercise survey.
     * Calls the #showExerciseQuestionTab method to display the questions.
     *
     * @private
     * @param {number} index - The index of the question to display.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    async #displayExerciseSurvey(index) {
        if (this.#data.length > 0) {
            let template;
            switch (this.#data[0].type) {
                case "leisureActivity":
                case "weeklyRecurringActivity":
                    template = "backAndForthActivityTable";
                    break;
                case "recurringPhysicalActivity":
                    template = "recurringPhysicalActivityTable";
                    break;
                case "householdActivity":
                    template = "householdActivityTable";
                    break;
                case "sportActivity":
                    template = "sportActivityTable";
                    break;
                default:
                    template = null;
            }

            this.#showExerciseQuestionTab(
                template,
                await this.#fetchOptions(this.#data[index].id),
                this.#data[this.#currentQuestion].text
            );
        }
    }

    /**
     * Displays the exercise survey questions on the survey view.
     *
     * @private
     * @param {string} templateId - The ID of the HTML template to use for displaying the questions.
     * @param {Array} options - An array of options for the given question.
     * @param {string} title - The title of the question to display.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    #showExerciseQuestionTab(templateId, options, title) {
        const questionTab = this.#surveyView.querySelector(`#${templateId}`).content
            .querySelector(".questionTab").cloneNode(true);
        questionTab.querySelector(".title").innerText = title;

        const nvtCheckbox = questionTab.querySelector(".nvtCheck");
        nvtCheckbox.addEventListener("change", () => {
            for (let i = 0; i < questionTab.querySelectorAll(".questionRow").length; i++) {
                this.#validation.toggleEnabledInput(questionTab.querySelectorAll(".questionRow")[i], !nvtCheckbox.checked);
            }
        });

        for (const question of options) {
            const row = questionTab.querySelector(".rowTemplate").content
                .querySelector(".questionRow").cloneNode(true);
            row.querySelector(".questionText").innerText = question.text;
            row.id = this.#data[this.#currentQuestion].id;

            for (let i = 0; i < row.querySelectorAll("input").length; i++) {
                if (row.querySelectorAll("input")[i].type === "number") {
                    row.querySelectorAll("input")[i].defaultValue = 0;
                }
                if (row.querySelectorAll("input")[i].type === "radio") {
                    row.querySelectorAll("input")[i].name = question.id;
                }
            }

            questionTab.querySelector("tbody").prepend(row);
        }

        this.#CONTAINER.appendChild(questionTab);
    }

    /**
     * Displays the nutrition survey question for the given index.
     * @private
     * @param {number} index - The index of the survey to display.
     * @returns {Promise<void>} - A Promise that resolves when the survey is displayed.
     * @author Junior Javier Brito Perez
     */
    async #displayNutritionSurvey(index) {
        const question = this.#data[index];
        const questionTab = this.#QUESTION_TEMPLATE.content
            .querySelector(".questionTab").cloneNode(true);
        const optionsContainer = questionTab.querySelector(".options-container");
        this.#data[this.#currentQuestion].options = await this.#fetchOptions(question.id);

        questionTab.id = question.id;
        questionTab.querySelector(".questionText").innerText =
            `(${index + 1}/${this.#data.length}) ${question.text}`;
        questionTab.querySelector(".alert").style.display = "none";

        if (question.hasOwnProperty("options") && question.options.length > 0) {
            for (let j = 0; j < question.options.length; j++) {
                const option = question.options[j].open === 0 ?
                    this.#CHECKBOX_OPTION.content.querySelector(".option").cloneNode(true) :
                    this.#CHECKBOX_FIELD_OPTION.content.querySelector(".option").cloneNode(true);

                option.querySelector(".optionText").innerText = question.options[j].text;
                optionsContainer.appendChild(option);
            }
        }
        if (question.hasOwnProperty("type") && question.type === "weeklyPortions") {
            this.displayWeeklyPortionsOption(optionsContainer);
        }
        this.#CONTAINER.appendChild(questionTab);
    }

    /**
     * Displays the weekly portions option for the given question.
     * @private
     * @param {HTMLElement} optionsContainer - The container element to append the weekly portions option to.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    displayWeeklyPortionsOption(optionsContainer) {
        const option = this.#RADIO_OPTION.content.querySelector(".option")
            .cloneNode(true);
        const radioBtnContainer = option.querySelector(".radio-button-container");

        optionsContainer.classList.add("d-flex", "flex-row", "justify-content-between");

        const daysOptionContainer = document.createElement("div");
        daysOptionContainer.classList.add("col-5", "daysOptionContainer");
        const portionsOptionContainer = document.createElement("div");
        portionsOptionContainer.classList.add("col-5", "portionsOptionContainer");

        const daysLbl = document.createElement("h4");
        daysLbl.classList.add("text-center");
        daysLbl.innerText = "Hoeveel dagen?";

        const portionsLbl = document.createElement("h4");
        portionsLbl.innerText = "Hoeveel porties per dag?";
        portionsLbl.classList.add("text-center");

        const portionOption = this.#RADIO_OPTION.content.querySelector(".option")
            .cloneNode(true);
        const portionBtnContainer = portionOption.querySelector(".radio-button-container");

        for (let j = 1; j <= 8; j++) {
            const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                .cloneNode(true);
            radioBtn.querySelector("#radioBtn").name = "portions-" + j;
            radioBtn.querySelector(".form-check-label").innerText = j === 8 ?
                "Meer dan 7" : String(j);
            portionBtnContainer.appendChild(radioBtn);
        }

        for (let j = 0; j < 8; j++) {
            const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                .cloneNode(true);
            radioBtn.querySelector("#radioBtn").name = "days-" + j;
            radioBtn.querySelector(".form-check-label").innerText = j === 0 ?
                "Nooit" : j === 7 ?
                    "Elke dag" : String(j);
            if (j === 0) {
                radioBtn.querySelector("#radioBtn").addEventListener("click", () => {
                    this.#validation.toggleEnabledInput(portionOption, false);
                });
            } else {
                radioBtn.querySelector("#radioBtn").addEventListener("click", () => {
                    this.#validation.toggleEnabledInput(portionOption, true);
                });
            }
            radioBtnContainer.appendChild(radioBtn);
        }

        daysOptionContainer.appendChild(daysLbl);
        daysOptionContainer.appendChild(option);
        portionsOptionContainer.appendChild(portionsLbl);
        portionsOptionContainer.appendChild(portionOption);
        optionsContainer.appendChild(daysOptionContainer);
        optionsContainer.appendChild(portionsOptionContainer);
    }

    /**
     * Calculates and displays the percentage of questions answered in the survey.
     * @private
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    #loadPercentage() {
        let x = this.#data.length - 1;
        let percentage = this.#currentQuestion === 0 ?
            0 : Math.round((this.#currentQuestion) / x * 100);
        this.#surveyView.querySelector(".progress-bar").style.width = percentage >= 1 ?
            percentage + "%" : "fit-content";
        this.#surveyView.querySelector(".progress-bar").innerText = percentage + "%";
    }

    /**
     * Displays the survey question at the given index on the survey view.
     * Determines whether to display the "previous" button or not based on the current question index.
     * Determines whether to display the "next" button as "Volgende" or "Bevestigen" based on whether the current question is the last one or not.
     *
     * @private
     * @param {number} index - The index of the question to display.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    #showTab(index) {
        if (this.#currentQuestion === 0) {
            this.#surveyView.querySelector(".prev").style.display = "none";
        } else {
            this.#surveyView.querySelector(".prev").style.display = "block";
        }

        if (this.#currentQuestion === (this.#data.length - 1)) {
            this.#surveyView.querySelector(".next").innerText = "Bevestigen";
        } else {
            this.#surveyView.querySelector(".next").innerText = "Volgende";
        }

        this.#displayQuestion(index);
        this.#loadPercentage();
    }

    /**
     * Allows the user to go to the next or previous question. If the user is on the last question,
     * the survey is submitted.
     * @private
     * @param {number} nextTabNumber \-1 for previous question, 1 for next question.
     * @returns {Promise<boolean>} true if the user is on the last question.
     * @author Junior Javier Brito Perez
     */
    async #nextPrev(nextTabNumber) {
        if (nextTabNumber === 1 && !this.#validateForm()) {
            return false
        }

        this.#getSurveyResponseData();
        this.#currentQuestion = this.#currentQuestion + nextTabNumber;

        if (this.#currentQuestion >= this.#data.length) {
            const response = await this.#surveyRepository.putSurveyResult({
                    surveyId: this.#data[0].surveyId,
                    data: this.#getAllAnswers()
                }
            );

            await this.#setupView();
            const alert = this.#surveyView.querySelector(".alert");
            alert.style.display = "block";

            if (response.failure) {
                alert.classList.add("alert-danger");
                alert.classList.remove("alert-success");
            }

            alert.innerText += response.message + "\n";

            this.#surveyView.querySelector(".questionContainer").innerHTML = "";
            this.#questionsAnswered = 0;
            return false;
        }
        this.#showTab(this.#currentQuestion);
    }

    /**
     * Validates the form of the current question.
     * @private
     * @returns {boolean} true if the form is valid.
     * @author Junior Javier Brito Perez
     */
    #validateForm() {
        if (this.#currentQuestion >= this.#data.length) return true;

        let valid = false;
        const alert = this.#CONTAINER.querySelector(".alert");

        this.#validation.resetBorderColors(this.#CONTAINER);

        if (this.#data[this.#currentQuestion].surveyId === 1) {
            valid = this.#validateNutritionSurvey();
        }

        if (this.#data[this.#currentQuestion].surveyId === 2) {
            valid = this.#validation.validateActivitySurvey(this.#CONTAINER, alert);
        }

        if (alert !== null) {
            alert.style.display = valid ? "none" : "block";
        }
        return valid;
    }

    /**
     * Validates the form of the current nutrition survey question based on its type.
     * @private
     * @returns {boolean} true if the form is valid.
     * @author Junior Javier Brito Perez
     */
    #validateNutritionSurvey() {
        const optionsCurrentQuestionTab = this.#CONTAINER.querySelectorAll(".option");
        let valid;
        const alert = this.#CONTAINER.querySelector(".alert");
        alert.style.display = "none";
        alert.innerText = "";

        switch (this.#data[this.#currentQuestion].type) {
            case "singleChoice":
                valid = this.#validation.validateSingleChoice(optionsCurrentQuestionTab, alert);
                break;
            case "portion":
            case "numberScale" :
                valid = this.#validation.validateNumberScale(optionsCurrentQuestionTab, alert);
                break;
            case "multipleChoice":
                valid = this.#validation.validateMultipleChoice(optionsCurrentQuestionTab, alert);
                break;
            case "weeklyPortions":
                valid = this.#validation.validateWeeklyPortions(this.#CONTAINER, alert);
                break;
            case "title":
                valid = true;
                break;
            default:
                valid = false;
                break;
        }
        return valid;
    }

    /**
     * Retrieves the survey response data based on the current question type and survey ID.
     * Updates the response data for the current question in the survey data object.
     * Sets the "notApplicable" property to true if the survey response is "Niet van toepassing", false otherwise.
     *
     * @private
     * @memberof surveyController
     * @author Junior Javier Brito Perez
     */
    #getSurveyResponseData() {
        let surveyData = [];

        if (this.#data[0].surveyId === 1) {
            surveyData = this.#getNutritionSurveyResponseData();
        } else if (this.#data[0].surveyId === 2) {
            surveyData = this.#getExerciseSurveyResponseData();
        }

        this.#data[this.#currentQuestion].response = surveyData;

        this.#data[this.#currentQuestion].notApplicable = surveyData.length > 0
            && surveyData[0].answer === "Niet van toepassing";
    }

    /**
     * Retrieves the survey response data for the current nutrition survey question.
     * Determines the type of question and calls the appropriate method to retrieve the response data.
     *
     * @private
     * @memberof surveyController
     * @returns {Array} An array of survey response data objects.
     * @author Junior Javier Brito Perez
     */
    #getNutritionSurveyResponseData() {
        const optionsCurrentQuestionTab = this.#CONTAINER.querySelectorAll(".option");
        const surveyData = [];
        switch (this.#data[this.#currentQuestion].type) {
            case "numberScale":
            case "portion" :
            case "singleChoice":
                surveyData.push(this.#getSingleChoiceData(optionsCurrentQuestionTab));
                break;
            case "multipleChoice":
                surveyData.push(this.#getMultipleChoiceData(optionsCurrentQuestionTab));
                break;
            case "weeklyPortions":
                surveyData.push(this.#getWeeklyPortionsData());
                break;
        }
        return surveyData;
    }

    /**
     * Retrieves the survey response data for a single choice question.
     * Determines the selected option and returns the corresponding survey response data object.
     *
     * @private
     * @memberof surveyController
     * @param {HTMLElement[]} options - An array of HTML elements representing the available options for the question.
     * @returns {Object} A survey response data object containing the survey ID, question ID, and selected answer.
     * @author Junior Javier Brito Perez
     */
    #getSingleChoiceData(options) {
        console.log("here")
        let answer;
        for (let i = 0; i < options.length; i++) {
            if (options[i].querySelector("input").checked) {
                if (options[i].querySelector(".input-field") !== null) {
                    answer = options[i].querySelector(".optionText").innerText + " " +
                        options[i].querySelector(".input-field").value;
                }
                answer = options[i].querySelector(".optionText").innerText;
            }
        }

        return {
            surveyId: 1,
            questionId: parseInt(this.#CONTAINER.querySelector(".questionTab").id),
            answer: answer
        }
    }

    /**
     * Retrieves the survey response data for a multiple choice question.
     * Determines the selected options and returns the corresponding survey response data object.
     *
     * @private
     * @memberof surveyController
     * @param {HTMLElement[]} options - An array of HTML elements representing the available options for the question.
     * @returns {Object} A survey response data object containing the survey ID, question ID, and selected answers.
     * @author Junior Javier Brito Perez
     */
    #getMultipleChoiceData(options) {
        let answers = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].querySelector("input").checked) {
                if (options[i].querySelector(".input-field") !== null) {
                    answers.push(options[i].querySelector(".optionText").innerText + " " +
                        options[i].querySelector(".input-field").value);
                }
                answers.push(options[i].querySelector(".optionText").innerText);
            }
        }

        return {
            surveyId: 1,
            questionId: parseInt(this.#CONTAINER.querySelector(".questionTab").id),
            answer: answers.join(", ")
        }
    }

    /**
     * Retrieves the survey response data for a question that asks about weekly food portions.
     * Determines the selected options and calculates the total number of portions per week.
     *
     * @private
     * @memberof surveyController
     * @returns {Object} A survey response data object containing the survey ID, question ID, and total number of portions per week.
     * @author Junior Javier Brito Perez
     */
    #getWeeklyPortionsData() {
        const dayOptions = this.#CONTAINER.querySelector(".daysOptionContainer")
            .querySelectorAll("#radioBtn");
        const portionOptions = this.#CONTAINER.querySelector(".portionsOptionContainer")
            .querySelectorAll("#radioBtn");
        let portionsPerWeek;

        if (dayOptions[0].checked) {
            portionsPerWeek = 0;
        } else {
            let daysPerWeek = 0;
            let portionsPerDay = 0;
            for (let i = 0; i < dayOptions.length; i++) {
                if (i === 7 && dayOptions[i].checked) {
                    daysPerWeek = 7;
                    break;
                }
                if (dayOptions[i].checked) {
                    daysPerWeek = i;
                }
            }

            for (let i = 0; i < portionOptions.length; i++) {
                if (i === 7 && portionOptions[i].checked) {
                    portionsPerDay = 8;
                    break;
                }
                if (portionOptions[i].checked) {
                    portionsPerDay = i + 1;
                }
            }

            portionsPerWeek = daysPerWeek * portionsPerDay;
        }

        return {
            surveyId: 1,
            questionId: parseInt(this.#CONTAINER.querySelector(".questionTab").id),
            answer: portionsPerWeek
        };
    }

    /**
     * Gathers the survey response data for all exercise questions.
     * Determines the selected options and calculates the total number of minutes per week.
     *
     * @private
     * @memberof surveyController
     * @param {HTMLElement[]} questions - An array of HTML elements representing the exercise questions.
     * @param {boolean} nvt - A boolean indicating whether the "Niet van toepassing" checkbox is checked.
     * @returns {Object[]} An array of survey response data objects containing the survey ID, question ID, and total number of minutes per week.
     * @author Junior Javier Brito Perez
     */
    #gatherExerciseAnswers(questions, nvt) {
        let data = [];
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const questionId = parseInt(question.id);
            const days = question.querySelector(".days") != null ?
                parseInt(question.querySelector(".days").value) : 1;
            const hours = parseInt(question.querySelector(".hours").value);
            const minutes = parseInt(question.querySelector(".minutes").value);
            const intensityRadios = question.querySelector(".intensity") != null ?
                question.querySelectorAll(".intensity") : null;
            const intensityLabels = question.querySelectorAll(".form-check-label");
            let intensity = null;

            if (intensityRadios != null) {
                for (let j = 0; j < intensityRadios.length; j++) {
                    if (intensityRadios[j].checked) {
                        intensity = intensityLabels[j].innerText;
                        break;
                    }
                }
            }

            const intensityInput = intensity != null ?
                ", intensity: " + intensity : "";

            let minutesCalc = days * (hours * 60 + minutes);

            data.push({
                surveyId: 2,
                questionId: questionId,
                answer: nvt || minutesCalc < 1 ? "Niet van toepassing" :
                    "minutes: " + minutesCalc + intensityInput
            });
        }
        return data;
    }


    /**
     * Gathers the survey response data for the current exercise questions.
     * Determines the selected options and calculates the total number of minutes per week.
     *
     * @private
     * @memberof surveyController
     * @returns {Object[]} An array of survey response data objects containing the survey ID, question ID, and total number of minutes per week.
     * @author Junior Javier Brito Perez
     */
    #getExerciseSurveyResponseData() {
        const surveyData = [];
        const nvt = this.#CONTAINER.querySelector(".nvtCheck").checked;
        const questions = this.#CONTAINER.querySelectorAll(".questionRow");
        const data = this.#gatherExerciseAnswers(questions, nvt)
        for (let j = 0; j < data.length; j++) {
            surveyData.push(data[j]);
        }
        return surveyData;
    }

    /**
     * Retrieves all survey response data for the current survey.
     *
     * @private
     * @memberof surveyController
     * @returns {Array} An array of all survey response data objects for the current survey.
     * @author Junior Javier Brito Perez
     */
    #getAllAnswers() {
        const responseData = [];
        for (let question of this.#data) {
            if (question.hasOwnProperty("response")) {
                for (let response of question.response) {
                    responseData.push(response);
                }
            }
        }

        return responseData;
    }
}

