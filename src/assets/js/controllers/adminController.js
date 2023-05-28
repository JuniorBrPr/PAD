/**
 * Controller responsible for all events in admin view
 * @author Jayden.G
 */

import {Controller} from "./controller.js";
import {AdminRepository} from "../repositories/adminRepository.js";

export class AdminController extends Controller {

    #adminView
    #adminRepository

    constructor() {
        super();
        this.#adminRepository = new AdminRepository();

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
        this.#adminView = await super.loadHtmlIntoContent("html_views/admin.html");

        this.#setupDownloadButton();

        await this.#setupSurveyPreview();
    }

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

    async #setupSurveyPreview() {
        this.#adminView.querySelector('#voeding-survey-btn').addEventListener('click', async () => {
            const data = await this.#adminRepository.getNutritionSurveyContent();

            this.#displaySurveyPreview(data);
        });

        this.#adminView.querySelector('#beweging-survey-btn').addEventListener('click', async () => {
            const data = await this.#adminRepository.getExerciseSurveyContent();

            this.#displaySurveyPreview(data);
        });
    }

    #displaySurveyPreview(surveyData) {

        if (surveyData === undefined) {
            return;
        }

        const buttonBox = this.#adminView.querySelector('#button-box');
        const previewBox = this.#adminView.querySelector('#preview-box');

        buttonBox.classList.add('d-none'); // Corrected here
        previewBox.classList.remove('d-none')


        for (const question of surveyData) {
            console.log(question);
        }
    }
}