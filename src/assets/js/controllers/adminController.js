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
    }
}