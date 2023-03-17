import {Controller} from "./controller.js";
import {profileRepository} from "../repositories/profileRepository.js";


export class profileController extends Controller {
    #createProfileView
    #profileRepository
    #data
    constructor() {
        super();
        this.#profileRepository = new profileRepository()
        this.#setupView();
    }

    async #setupView() {
        this.#createProfileView = await super.loadHtmlIntoContent("html_views/profile.html")
        this.#fetchUserData(1);
    }

    async #fetchUserData(userId){
        const fullname = document.getElementById("profileFullName")
        try {
            const data = await this.#profileRepository.getData(userId);
            console.log(data[0])
            fullname.innerHTML = data.data[0].firstname + " " + data.data[0].surname
            document.getElementById("profileEmail").innerHTML = data.data[0].emailAdress
            document.getElementById("profileAge").innerHTML = this.#calculateAge(data.data[0].date_of_birth) + " Jaar"
            document.getElementById("profileHeight").innerHTML = data.data[0].height + " CM"
            document.getElementById("profileWeight").innerHTML = data.data[0].weight + " Kilo"
        } catch (e) {
            console.log("Error while loading", e)
        }
    }

    #calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
}

