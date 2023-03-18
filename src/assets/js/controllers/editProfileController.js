import {Controller} from "./controller.js";
import {editProfileRepository} from "../repositories/editProfileRepository.js";


export class editProfileController extends Controller {
    #createProfileEditView
    #editProfileRepository
    #data
    constructor() {
        super();
        this.#editProfileRepository = new editProfileRepository()
        this.#setupView();
    }

    async #setupView() {
        this.#createProfileEditView = await super.loadHtmlIntoContent("html_views/editProfile.html")
        document.getElementById("saveProfileBtn").addEventListener("click", (event) => this.#sendData(1));
    }

    async #sendData(userId) {
        const firstname = document.getElementById("InputFirstname").value
        const surname = document.getElementById("InputSurname").value
        const email = document.getElementById("InputEmail").value
        const weight = document.getElementById("InputWeight").value
        const height = document.getElementById("InputHeight").value
        const age = document.getElementById("InputAge").value

        try {
            const data = await this.#editProfileRepository.sendData(firstname,surname,email,weight,height,age, userId)
        } catch (e){
            console.log("Er is iets fout gegaan", e)
        }
    }
}