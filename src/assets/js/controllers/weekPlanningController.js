
import {Controller} from "./controller.js";
import {App} from "../app.js";


export class WeekPlanningController extends Controller {
    #weekPlanningView

    //#registerRepository;

    constructor() {
        super();

        //this.#registerRepository = new RegisterRepository();
        this.#setupView()
    }

    async #setupView() {
        this.#weekPlanningView = await super.loadHtmlIntoContent("html_views/weekPlanning.html")

        // this.#weekPlanningView.querySelector(".btn").addEventListener("click",
        //     (event) => this.#saveWeekplanning(event));

    }

    // #saveweekPlanning(event) {
    //     event.preventDefault();
    // }


}