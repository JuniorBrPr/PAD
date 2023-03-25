import {Controller} from "./controller.js";

export class profileController extends Controller {
    #createProfileView

    constructor() {
        super();
        this.#setupView();
    }

    async #setupView() {
        this.#createProfileView = await super.loadHtmlIntoContent("html_views/profile.html")
    }
}

