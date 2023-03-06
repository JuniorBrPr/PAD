import { SurveyRepository} from "../repositories/surveyRepository";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class SurveyController extends Controller {
    #surveyRepository
    #surveyView

    constructor() {
        super();
        this.#surveyRepository = new SurveyRepository();

        this.#setupView()
    }

    async #setupView() {

        this.#surveyView = await super.loadHtmlIntoContent("html_views/survey.html")
    }
}
