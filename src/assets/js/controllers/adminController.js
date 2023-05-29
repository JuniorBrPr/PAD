/**
 * Controller responsible for all events in admin view.
 * @class
 * @extends Controller
 * @author Jayden.G
 */

import {Controller} from "./controller.js";
import {AdminRepository} from "../repositories/adminRepository.js";

export class AdminController extends Controller {

    #adminView
    #adminRepository
    #questionIndex

    /**
     * AdminController constructor.
     */

    constructor() {
        super();
        this.#adminRepository = new AdminRepository();
        this.#questionIndex = 0;

        this.#setupView();
    }

    /**
     * @author Jayden.G
     * Loads contents of desired HTML file into content class
     *
     * @private
     * @returns {Promise<void>}
     */

    async #setupView() {
        this.#adminView = await super.loadHtmlIntoContent("html_views/admin.html");

        this.#setupDownloadButton();

        await this.#setupSurveyPreview();
    }

    /**
     * @author Jayden.G
     * Set up the CSV download button to download the survey results.
     *
     * @private
     */

    #setupDownloadButton() {
        const downloadButton = this.#adminView.querySelector('#download-csv-btn');
        downloadButton.addEventListener("click", async () => {
            try {
                const response = await this.#adminRepository.getSurveyResults();

                const csvData = response.csvData; // Extract the actual CSV data

                const blob = new Blob([csvData], {type: 'text/csv'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = 'survey-details.csv';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                console.error(e);
                // TODO: Handle error, show a notification to the user.
            }
        });
    }

    /**
     * @author Jayden.G
     * Set up the survey preview.
     *
     * @private
     * @returns {Promise<void>}
     */

    async #setupSurveyPreview() {
        this.#adminView.querySelector('#voeding-survey-btn').addEventListener('click', async () => {
            const data = await this.#adminRepository.getNutritionSurveyContent();

            this.#displaySurveyPreview(data);
        });

        this.#adminView.querySelector('#beweging-survey-btn').addEventListener('click', async () => {
            const data = await this.#adminRepository.getExerciseSurveyContent();

            this.#displaySurveyPreview(data);
        });

        this.#adminView.querySelector('#nextBtn').addEventListener('click', () => {
            this.#showNextQuestion();
        });

        this.#adminView.querySelector('#prevBtn').addEventListener('click', () => {
            this.#showPreviousQuestion();
        });

        this.#adminView.querySelector('#backBtn').addEventListener('click', () => {
            this.#showSurveySelection();
        });
    }

    /**
     * @author Jayden.G
     * Display the preview of the given survey data.
     *
     * @private
     * @param {Array<Object>} surveyData - The data for the survey to be previewed.
     */

    #displaySurveyPreview(surveyData) {

        if (surveyData === undefined) {
            return;
        }

        const buttonBox = this.#adminView.querySelector('#button-box');
        const previewBox = this.#adminView.querySelector('#preview-box');
        const questionContainer = this.#adminView.querySelector("#question-container");
        const questionTemplate = this.#adminView.querySelector("#question-template").cloneNode(true);

        buttonBox.classList.add('d-none');
        previewBox.classList.remove('d-none')

        for (let i = 0; i < surveyData.length; i++) {
            const card = questionTemplate.content.querySelector(".card").cloneNode(true);

            card.dataset.id = i
            card.classList.add('d-none')

            card.querySelector(".question-title").innerText = `${i+1}. ${surveyData[i].text}`;

            let questionType = ''

            switch(surveyData[i].type) {
                case 'singleChoice':
                    questionType = 'Enkele Keuzevraag';
                    break;
                case 'multipleChoice':
                    questionType = 'Meerkeuze Vraag';
                    break;
                case 'numberScale':
                    questionType = 'Nummer Schaal';
                    break;
                case 'weeklyPortions':
                    questionType = 'Wekelijkse Porties';
                    break;
                default:
                    questionType = `${surveyData[i].type}`;
            }

            card.querySelector(".question-type").innerText = `Type vraag: ${questionType}`;

            const answerContainer = card.querySelector('#options-container');

            if (!surveyData[i].answers.length) {
                const answerElement = document.createElement('p');  // or any other element that suits your design
                answerElement.innerText = `Geen specifieke antwoorden.`;
                answerContainer.appendChild(answerElement);
            } else {
                for (let j = 0; j < surveyData[i].answers.length; j++) {
                    const answerElement = document.createElement('p');  // or any other element that suits your design
                    answerElement.innerText = `${j+1}. ${surveyData[i].answers[j].value}`;
                    answerContainer.appendChild(answerElement);
                }
            }

            questionContainer.appendChild(card);
        }

        this.#showQuestion(this.#questionIndex);
    }

    /**
     * @author Jayden.G
     * Show the question at the given index in the survey preview.
     *
     * @private
     * @param {number} index - The index of the question to be shown.
     */

    #showQuestion(index) {
        const cards = this.#adminView.querySelectorAll("#question-container .card");
        cards.forEach(card => {
            if (Number(card.dataset.id) === index) { // Convert to Number
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        });
    }

    /**
     * @author Jayden.G
     *
     * Show the next question in the survey preview.
     * @private
     */

    #showNextQuestion() {
        const maxIndex = this.#adminView.querySelectorAll("#question-container .card").length - 1;
        if (this.#questionIndex < maxIndex) {
            this.#questionIndex++;
            this.#showQuestion(this.#questionIndex);
        }
    }

    /**
     * @author Jayden.G
     *
     * Show the previous question in the survey preview.
     * @private
     */

    #showPreviousQuestion() {
        if (this.#questionIndex > 0) {
            this.#questionIndex--;
            this.#showQuestion(this.#questionIndex);
        }
    }

    /**
     * @author Jayden.G
     *
     * Go back to the survey selection view, hiding the questions and clearing the current ones.
     * @private
     */

    #showSurveySelection() {
        const buttonBox = this.#adminView.querySelector('#button-box');
        const previewBox = this.#adminView.querySelector('#preview-box');
        const questionContainer = this.#adminView.querySelector("#question-container");

        // Hide the questions and show the survey selection
        buttonBox.classList.remove('d-none');
        previewBox.classList.add('d-none');

        // Clear the current questions
        while (questionContainer.firstChild) {
            questionContainer.firstChild.remove();
        }

        // Reset the question index
        this.#questionIndex = 0;
    }
}