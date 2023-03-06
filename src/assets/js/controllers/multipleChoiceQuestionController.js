import {SurveyRepository} from "../repositories/surveyRepository";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class MultipleChoiceQuestionController extends Controller{
    #surveyRepository
    #multipleChoiceQuestionView

    constructor() {
        super();
        this.#surveyRepository = new SurveyRepository();

        this.#setupView()
    }

    async #setupView() {
        // @TODO: Load the HTML file into Survey view
        this.#multipleChoiceQuestionView = await super.loadHtmlIntoCustomElement("html_views/multipleChoiceQuestion.html", "survey-form")

    }

    async #loadQuestion() {

    }

    async #loadOptions() {
    }
}