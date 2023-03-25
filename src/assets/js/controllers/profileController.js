import {Controller} from "./controller.js";
<<<<<<< HEAD

export class profileController extends Controller {
    #createProfileView

    constructor() {
        super();
=======
import {profileRepository} from "../repositories/profileRepository.js";


export class profileController extends Controller {
    #createProfileView
    #profileRepository
    #data
    constructor() {
        super();
        this.#profileRepository = new profileRepository()
>>>>>>> cefd42cd7d11bd82b28e71143bb564c8a8c93b4e
        this.#setupView();
    }

    async #setupView() {
        this.#createProfileView = await super.loadHtmlIntoContent("html_views/profile.html")
<<<<<<< HEAD
    }
=======
        this.#fetchUserData(1);
        document.getElementById("buttonWijzig").addEventListener("click", (event) => super.loadHtmlIntoContent("html_views/editProfile.html"));

    }

    async #fetchUserData(userId){
        try {
            const data = await this.#profileRepository.getData(userId);
            document.getElementById("profileFullName").innerHTML = data.data[0].firstname + " " + data.data[0].surname
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

>>>>>>> cefd42cd7d11bd82b28e71143bb564c8a8c93b4e
}

