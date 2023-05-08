/**
 * Controller responsible for all events in activity view
 * @author Jayden.G
 */

import {Controller} from "./controller.js";
import {App} from "../app.js";

export class ErrorController extends Controller {

    #errorView
    #httpCode
    #message

    constructor(controllerData) {
        super();

        this.#httpCode = controllerData.httpCode;
        this.#message = controllerData.message;

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
        this.#errorView = await super.loadHtmlIntoContent("html_views/errorView.html");

        this.#errorView.querySelector(".httpCode").innerText = this.#httpCode;
        this.#errorView.querySelector(".lead").innerText = this.#message;

        await this.#startCountdownAndRedirect(10);
    }

    async #startCountdownAndRedirect(seconds) {
        const countdownElement = this.#errorView.querySelector(".countdown");
        countdownElement.innerText = seconds;

        const countdownInterval = setInterval(() => {
            seconds--;
            countdownElement.innerText = seconds;

            if (seconds <= 0) {
                clearInterval(countdownInterval);
                App.loadController(App.CONTROLLER_LOGIN);
            }
        }, 1000);
    }
}