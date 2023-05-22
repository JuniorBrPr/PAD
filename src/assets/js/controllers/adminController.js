/**
 * Controller responsible for all events in admin view
 * @author Jayden.G
 */

import {Controller} from "./controller.js";

export class AdminController extends Controller {

    #adminView

    constructor() {
        super();

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

    }
}