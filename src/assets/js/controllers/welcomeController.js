/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {RoomsExampleRepository} from "../repositories/roomsExampleRepository.js";
import {App} from "../app.js";
import {Controller} from "./controller.js";

export class WelcomeController extends Controller{
    #roomExampleRepository
    #welcomeView

    constructor() {
        super();
        this.#roomExampleRepository = new RoomsExampleRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        //await for when HTML is loaded
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/welcome.html")

        //from here we can safely get elements from the view via the right getter
        this.#welcomeView.querySelector("span.name").innerHTML = this.#handleWelcomeName();
    }

    #handleWelcomeName() {
        if(App.sessionManager.get("firstname") !== undefined) {
            return App.sessionManager.get("firstname");
        } else {
            return "bezoeker";
        }
    }
}