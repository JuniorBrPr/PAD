import {Controller} from "./controller.js";
import {ActivityCompatibilityRepository} from "../repositories/activityCompatibilityRepository.js";

export class activityFrequencyController extends Controller {
    #frequencyView;
    #frequencyRepository;
    #data;
    #activityRepository;


    constructor() {
        super();
        this.#activityRepository = new ActivityCompatibilityRepository();
        this.#setupView();
    }

    async #setupView() {
        console.log(this.#data);

        this.#frequencyView = await super.loadHtmlIntoContent("html_views/activityFrequencyQuestion.html")
        // document.getElementById("questionText").innerText = this.#data[3];
        // document.getElementById("questionText").innerText = this.#fetchActivities().value;

    }

    async #fetchActivities(){
        this.#data = await this.#activityRepository.getActivities();
    }

}
