import {Controller} from "./controller.js";
import {editProfileRepository} from "../repositories/editProfileRepository.js";


export class editProfileController extends Controller {
    #createProfileEditView
    #profileEditRepository
    #data
    constructor() {
        super();
        this.#profileEditRepository = new editProfileRepository()
        this.#setupView();
    }

    async #setupView() {
        this.#createProfileEditView = await super.loadHtmlIntoContent("html_views/profileEdit.html")
    }
}