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
    }

    #setupDownloadButton() {
        const downloadButton = document.getElementById("download-csv-btn");
        downloadButton.addEventListener("click", async () => {
            try {
                const response = await this.#adminRepository.getSurveyCSV();

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
}