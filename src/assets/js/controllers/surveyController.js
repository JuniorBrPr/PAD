import {SurveyRepository} from "../repositories/surveyRepository.js";
import {Controller} from "./controller.js";
import {App} from "../app.js";

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
     * @returns {Promise<void>}
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
     */
    #displayQuestions() {
        if (this.#data.length > 0 && this.#data[0].surveyId === 1) {
            this.#displayNutritionSurvey();
        } else if (this.#data.length > 0 && this.#data[0].surveyId === 2) {
            this.#displayExerciseSurvey();
        }
        this.#showTab();
    }

    #displayExerciseSurvey() {
        const weeklyRecurringActivityQuestions =
            this.#data.filter(question => question.type === "weeklyRecurringActivity");
        const recurringPhysicalActivityQuestions =
            this.#data.filter(question => question.type === "recurringPhysicalActivity");
        const householdActivityQuestions = this.#data.filter(question => question.type === "householdActivity");
        const leisureActivityQuestions = this.#data.filter(question => question.type === "leisureActivity");
        const sportActivityQuestions = this.#data.filter(question => question.type === "sportActivity");

        this.#createExerciseQuestionTab(
            "backAndForthActivityTable",
            weeklyRecurringActivityQuestions,
            "Vervoer ten behoeve van terugkerende, geplande activiteiten (heen en terug).",
            "Geef aan hoe vaak je per week naar een activiteit gaat en hoe lang je er over doet om er te " +
            "komen en weer terug te gaan.Bijvoorbeeld mantel-zorg, oppassen, vrijwilligerswerk, cursus volgen etc."
        );

        this.#createExerciseQuestionTab(
            "recurringPhysicalActivityTable",
            recurringPhysicalActivityQuestions,
            "Lichamelijke activiteit op de vorige terugkerende bezigheden of vrijwilligerswerk, indien van" +
            " toepassing (niet zijnde huishoudelijk werk en vrijetijdsbestedingen)",
            ""
        );

        this.#createExerciseQuestionTab(
            "householdActivityTable",
            householdActivityQuestions,
            "Huishoudelijke activiteiten",
            "Geef aan hoe vaak je per week huishoudelijke activiteiten doet en hoe lang je er over doet. "
        );

        this.#createExerciseQuestionTab(
            "backAndForthActivityTable",
            leisureActivityQuestions,
            "Vrijetijdsbesteding",
            "Activiteiten voor eigen plezier."
        );

        // this.#createExerciseQuestionTab(
        //     "backAndForthActivityTable",
        //     sportActivityQuestions,
        //     "Sporten",
        //     "Sporten voor eigen plezier."
        // );
    }

    #createExerciseQuestionTab(templateId, questions, title, subtitle) {
        const questionTab = this.#surveyView.querySelector(`#${templateId}`).content
            .querySelector(".questionTab").cloneNode(true);
        questionTab.style.display = "none";
        questionTab.querySelector(".title").innerText = title;
        questionTab.querySelector(".subtitle").innerText = subtitle;

        const nvtCheckbox = questionTab.querySelector(".nvtCheck");
        nvtCheckbox.addEventListener("change", () => {
            for (let i = 0; i < questionTab.querySelectorAll(".questionRow").length; i++) {
                this.#toggleEnabledInput(questionTab.querySelectorAll(".questionRow")[i], !nvtCheckbox.checked);
            }
        });

        for (const question of questions) {
            const row = questionTab.querySelector(".rowTemplate").content
                .querySelector(".questionRow").cloneNode(true);
            row.querySelector(".questionText").innerText = question.text;
            row.id = question.id;

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

    #displayNutritionSurvey() {
        for (let i = 0; i < this.#data.length; i++) {
            const question = this.#data[i];
            const questionTab = this.#QUESTION_TEMPLATE.content
                .querySelector(".questionTab").cloneNode(true);
            questionTab.id = question.id;
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
                                    radioBtn.querySelector("#radioBtn").name = "portions-" + i;
                                    radioBtn.querySelector(".form-check-label").innerText = j === 8 ?
                                        "Meer dan 7" : String(j);
                                    portionBtnContainer.appendChild(radioBtn);
                                }

                                for (let j = 0; j < 8; j++) {
                                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                                        .cloneNode(true);
                                    radioBtn.querySelector("#radioBtn").name = "days-" + i;
                                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ?
                                        "Nooit" : j === 7 ?
                                            "Elke dag" : String(j);
                                    if (j === 0) {
                                        radioBtn.querySelector("#radioBtn").addEventListener("click", () => {
                                            this.#toggleEnabledInput(portionOption, false);
                                        });
                                    } else {
                                        radioBtn.querySelector("#radioBtn").addEventListener("click", () => {
                                            this.#toggleEnabledInput(portionOption, true);
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
                                break;
                            case "portion":
                                for (let j = 1; j <= 8; j++) {
                                    const radioBtn = this.#RADIO_BUTTON.content.querySelector(".form-check")
                                        .cloneNode(true);
                                    radioBtn.querySelector(".form-check-label").innerText = String(j);
                                    optionsContainer.appendChild(radioBtn);
                                }
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
        this.#questionsAnswered = this.#currentQuestion > this.#questionsAnswered ?
            this.#currentQuestion : this.#questionsAnswered;

        if (this.#currentQuestion >= questionTabs.length) {
            // TODO: remove hardcoded user id
            if (this.#data[0].surveyId === 2) {
                await this.#setupView();
                return;
            }
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
     */
    #validateForm() {
        if (this.#currentQuestion >= this.#data.length) return true;

        const questionTabs = this.#surveyView.getElementsByClassName("questionTab");
        let currentQuestionTab;
        let valid = false;
        let alert;

        if (this.#data[this.#currentQuestion].surveyId === 1) {
            const optionsCurrentQuestionTab = questionTabs[this.#currentQuestion].querySelectorAll(".option");
            alert = this.#currentQuestion < questionTabs.length ?
                questionTabs[this.#currentQuestion].querySelector(".alert") : null;
            alert.style.display = "none";

            currentQuestionTab = questionTabs[this.#currentQuestion];
            this.#resetBorderColors(currentQuestionTab)

            switch (this.#data[this.#currentQuestion].type) {
                case "singleChoice":
                    valid = this.#validateSingleChoice(optionsCurrentQuestionTab, alert);
                    break;
                case "portion":
                case "numberScale" :
                    valid = this.#validateNumberScale(questionTabs[this.#currentQuestion].querySelectorAll("#radioBtn"),
                        alert);
                    break;
                case "multipleChoice":
                    valid = this.#validateMultipleChoice(optionsCurrentQuestionTab, alert);
                    break;
                case "weeklyPortions":
                    valid = this.#validateWeeklyPortions(questionTabs[this.#currentQuestion], alert);
                    break;
                case "title":
                    valid = true;
                    break;
                default:
                    valid = false;
                    break;
            }
        }

        if (this.#data[0].surveyId === 2) {
            for (let i = 0; i < questionTabs.length; i++) {
                if (questionTabs[i].style.display === "block") {
                    currentQuestionTab = questionTabs[i];
                    this.#resetBorderColors(currentQuestionTab);

                    alert = questionTabs[i].querySelector(".alert");
                    alert.style.display = "none";

                    valid = this.#validateActivitySurvey(questionTabs[i], alert);
                }
            }
        }

        if (alert !== null) {
            alert.style.display = valid ? "none" : "block";
        }
        return valid;
    }

    #resetBorderColors(questionTab) {
        const inputs = questionTab.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.borderColor = "";
        }
    }

    #toggleEnabledInput(container, enabled) {
        const inputs = container.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = !enabled;
        }
    }

    #validateActivitySurvey(questionTab, alert) {
        const questionsCurrentQuestionTab = questionTab.querySelectorAll(".questionRow");
        const nvtCheckbox = questionTab.querySelector(".nvtCheck");

        if (nvtCheckbox.checked) {
            return true;
        } else {
            if (this.#validateAllZero(questionTab)) {
                alert.innerText = "Vul minstens één waarde in.";
                return false;
            }
            let valid = true;
            for (let i = 0; i < questionsCurrentQuestionTab.length; i++) {
                if (!this.#validateQuestion(questionsCurrentQuestionTab[i], alert)) {
                    valid = false;
                }
            }
            return valid;
        }

    }

    #validateQuestion(question, alert) {
        if (this.#validateAllZero(question)) {
            return true;
        }
        const inputs = question.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === "number") {
                if (!this.#validateNumberInput(inputs[i], alert)) {
                    return false;
                }
            }
        }
        const radios = question.querySelectorAll(".radio");
        if (radios.length > 0) {
            if (!this.#validateRadiosInput(radios, alert)) {
                return false;
            }
        }
        return true;
    }

    #validateAllZero(question) {
        const inputs = question.querySelectorAll("input[type=number]");
        for (let i = 0; i < inputs.length; i++) {
            if (parseInt(inputs[i].value) !== 0) {
                return false;
            }
        }
        return true;
    }

    #validateNumberInput(input, alert) {
        if (input.value === "") {
            input.style.borderColor = "red";
            alert.innerText = "Gelieve alle velden in te vullen.";
            return false;
        }
        if (parseInt(input.value) < input.min) {
            input.style.borderColor = "red";
            alert.innerText = `Gelieve een waarde groter dan ${input.min} in te vullen.`;
            return false;
        }
        if (parseInt(input.value) > input.max) {
            input.style.borderColor = "red";
            alert.innerText = `Gelieve een waarde kleiner dan ${input.max} in te vullen.`;
            return false;
        }
        return true;
    }

    #validateRadiosInput(radios, alert) {
        let checked = 0;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                checked++;
                break;
            }
        }
        if (checked === 0) {
            alert.innerText = "Gelieve een antwoord te selecteren.";
            for (let i = 0; i < radios.length; i++) {
                radios[i].style.borderColor = "red";
            }
            return false;
        } else {
            return true;
        }
    }

    #validateSingleChoice(optionsCurrentQuestionTab, alert) {
        let checked = 0;
        for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
            if (checked > 1) break;
            if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
                checked++;
            }
        }

        if (checked === 1) {
            return true;
        } else if (checked > 1) {
            alert.innerText = "Gelieve slechts 1 antwoord te selecteren.";
            return false;
        } else {
            alert.innerText = "Gelieve een antwoord te selecteren.";
            return false;
        }
    }

    #validateNumberScale(optionsCurrentQuestionTab, alert) {
        for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
            if (optionsCurrentQuestionTab[i].checked) {
                return true;
            }
        }
        alert.innerText = "Gelieve een antwoord te selecteren.";
        return false;
    }

    #validateMultipleChoice(optionsCurrentQuestionTab, alert) {
        for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
            if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
                return true;
            }
        }
        alert.innerText = "Gelieve een antwoord te selecteren.";
        return false;
    }

    #validateWeeklyPortions(currentQuestionTab, alert) {
        const dayOptions = currentQuestionTab.querySelector(".daysOptionContainer")
            .querySelectorAll("#radioBtn");
        const portionOptions = currentQuestionTab.querySelector(".portionsOptionContainer")
            .querySelectorAll("#radioBtn");

        for (let i = 0; i < dayOptions.length; i++) {
            if (dayOptions[i].checked) {
                if (i === 0) {
                    for (let j = 0; j < portionOptions.length; j++) {
                        if (portionOptions[j].checked) {
                            portionOptions[j].checked = false;
                            return true;
                        }
                    }
                    portionOptions.forEach(option => {
                        if (option.checked) {
                            option.checked = false;
                        }
                    });
                    return true;
                } else {
                    for (let j = 0; j < portionOptions.length; j++) {
                        if (portionOptions[j].checked) {
                            return true;
                        }
                    }
                    alert.innerText = "Gelieve aantal porties te selecteren.";
                    return false;
                }
            }
        }
        alert.innerText = "Gelieve een antwoord te selecteren.";
        return false;
    }


    /**
     * Gets the survey response data.
     * @param completed {boolean} true if the user has answered all the questions in the current survey.
     * @returns {{surveyId: number, data: [{id: number, options: [{text: string, open: boolean}] }] }}
     * @private
     */
    #getSurveyResponseData(completed) {
        //TODO: Implement data collection for all types of questions.
        let responseData;
        const questionTabs = this.#surveyView.querySelectorAll(".questionTab");
        const range = completed ? this.#data.length : this.#questionsAnswered;

        let surveyData = [];
        if (this.#data[0].surveyId === 1) {
            surveyData = this.#getNutritionSurveyResponseData(questionTabs, completed, range);
        } else if (this.#data[0].surveyId === 2) {
            surveyData = this.#getExerciseSurveyResponseData(questionTabs, completed, range);
        }

        responseData = {
            surveyId: this.#data[0].surveyId,
            data: surveyData,
        };

        return responseData;
    }

    #getNutritionSurveyResponseData(questionTabs, completed, range) {
        const surveyData = [];
        for (let i = 0; i < range; i++) {
            const questionTab = questionTabs[i];
            const questionId = parseInt(questionTab.id);
            const questionType = this.#data.find(question => question.id === questionId).type;

            switch (questionType) {
                case "numberScale":
                case "portion" :
                case "singleChoice":
                    surveyData.push(this.#getSingleChoiceData(questionTab));
                    break;
                case "multipleChoice":
                    surveyData.push(this.#getMultipleChoiceData(questionTab));
                    break;
                case "weeklyPortions":
                    surveyData.push(this.#getWeeklyPortionsData(questionTab));
                    break;
            }
        }
        return surveyData;
    }

    #getSingleChoiceData(questionTab) {
        const options = questionTab.querySelectorAll(".option");
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
            questionId: parseInt(questionTab.id),
            answer: answer
        }
    }

    #getMultipleChoiceData(questionTab) {
        const options = questionTab.querySelectorAll(".option");
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
            questionId: parseInt(questionTab.id),
            answer: answers.join(", ")
        }
    }

    #getWeeklyPortionsData(questionTab) {
        const dayOptions = questionTab.querySelector(".daysOptionContainer")
            .querySelectorAll("#radioBtn");
        const portionOptions = questionTab.querySelector(".portionsOptionContainer")
            .querySelectorAll("#radioBtn");

        let portionsPerWeek = 0;

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
            questionId: parseInt(questionTab.id),
            answer: portionsPerWeek
        };
    }

    #getExerciseSurveyResponseData(questionTabs, completed, range) {
        return [];
    }
}

