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

        this.#surveyView.querySelector("#beweging-survey-btn")
            .addEventListener("click", () => {
                this.#fetchFrequencyQuestions();

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
        const CHECKBOX_OPTION = this.#surveyView.querySelector("#checkbox").cloneNode(true);
        const CHECKBOX_FIELD_OPTION = this.#surveyView.querySelector("#checkboxWithField").cloneNode(true);
        const RADIO_OPTION = this.#surveyView.querySelector("#radio").cloneNode(true);
        const RADIO_BUTTON = this.#surveyView.querySelector("#radioButton").cloneNode(true);

        for (let i = 0; i < this.#data.length; i++) {
            const question = this.#data[i];
            const questionTab = questionTemplate.content.querySelector(".questionTab").cloneNode(true);
            questionTab.style.display = "none";
            questionTab.querySelector(".questionText").innerText = question.text;
            questionTab.querySelector(".alert").style.display = "none";
            const optionsContainer = questionTab.querySelector(".options-container");

            // @todo: move to separate function, refactor
            if (question.hasOwnProperty("options")) {
                for (let j = 0; j < question.options.length; j++) {
                    if (question.options[j].open === 0) {
                        const option = CHECKBOX_OPTION.content.querySelector(".option").cloneNode(true);
                        option.querySelector(".optionText").innerText = question.options[j].text;
                        optionsContainer.appendChild(option);
                    } else if (question.options[j].open === 1) {
                        const option = CHECKBOX_FIELD_OPTION.content.querySelector(".option")
                            .cloneNode(true);
                        option.querySelector(".optionText").innerText = question.options[j].text;
                        optionsContainer.appendChild(option);
                    }
                }
            } else if (question.type === "numberScale") {
                const option = RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 0; j < 8; j++) {
                    const radioBtn = RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ? "Nooit" : j === 7 ? "Elke dag" : String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            } else if (question.type === "portion") {
                const option = RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 1; j <= 8; j++) {
                    const radioBtn = RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            } else if (question.type === "frequency") {
                const option = RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 0; j < 8; j++) {
                    const radioBtn = RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ? "Nooit" : j === 7 ? "Elke dag" : String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            } else if (question.type === "yesNo") {
                const option = RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 0; j < 2; j++) {
                    const radioBtn = RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ? "Ja" : j === 1 ? "Niet van toepassing" : String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            } else if (question.type === "time") {
                const option = RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 0; j < 5; j++) {
                    const radioBtn = RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ? "0 minuten" : j === 1 ? "15 minuten" : j === 2 ? "30 minuten"
                        : j === 3 ? "45 minuten" : j === 4 ? "60+ minuten" : String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
            } else if (question.type === "effort") {
                const option = RADIO_OPTION.content.querySelector(".option").cloneNode(true);
                const radioBtnContainer = option.querySelector(".radio-button-container");
                for (let j = 0; j < 3; j++) {
                    const radioBtn = RADIO_BUTTON.content.querySelector(".form-check").cloneNode(true);
                    radioBtn.querySelector(".form-check-label").innerText = j === 0 ? "licht inspannend" : j === 1 ? "matig inspannend"
                        : j === 2 ? "zwaar inspannend" : String(j);
                    radioBtnContainer.appendChild(radioBtn);
                }
                optionsContainer.appendChild(option);
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
        if(percentage > 99){
            this.#displayQuestions.querySelector(".questionText").innerText = "Bedankt voor het invullen van onze vragenlijst!";
        }
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
            // @todo: refactor
            await this.#surveyRepository.putSurveyResult(this.#getSurveyData(), 1);
            this.#surveyView.querySelector(".survey-form").style.display = "none";
            this.#surveyView.querySelector(".survey-welcome").style.display = "block";
            this.#surveyView.querySelector(".alert").style.display = "block";
            this.#surveyView.querySelector("#voeding-survey-btn").classList.add("disabled");
            this.#surveyView.querySelector("#beweging-survey-btn").classList.add("disabled");
            this.#surveyView.querySelector(".questionContainer").innerHTML = "";
            return false;
        }
        this.#showTab(this.#currentQuestion);
    }

    #validateForm() {
        let questionTabs = this.#surveyView.getElementsByClassName("questionTab");
        const alert = questionTabs[this.#currentQuestion].querySelector(".alert");
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
                    if (question.hasOwnProperty("options")) {
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
