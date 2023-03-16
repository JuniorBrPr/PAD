import {Controller} from "./controller.js";
import {profileRepository} from "../repositories/profileRepository.js";


export class profileController extends Controller {
    #createProfileView
    #profileRepository
    constructor() {
        super();
        this.#profileRepository = new profileRepository()
        this.#setupView();
    }

    async #setupView() {
        this.#profileRepository.getData()
        this.#createProfileView = await super.loadHtmlIntoContent("html_views/profile.html")
        document.getElementById("profileFullName").innerHTML = this.#profileRepository.firstname
        // document.getElementById("profileEmail").innerHTML = this.email
        // document.getElementById("profileAge").innerHTML = this.age + " Jaar"
        // document.getElementById("profileHeight").innerHTML = this.height + " CM"
        // document.getElementById("profileWeight").innerHTML = this.weight + " Kilo"

    }
}

