/**
 * Controller for create registration
 */

import {Controller} from "./controller.js";





export class RegisterController extends Controller {
    #registerView

    constructor() {
        super();

        this.#setupView()
    }

    async #setupView() {
        this.#registerView = await super.loadHtmlIntoContent("html_views/register.html")


    }
}