/**
 * Represents a profile controller for managing user profiles.
 * @extends Controller
 *
 * @Joey_Poel
 */
import {Controller} from "./controller.js";
import {profileRepository} from "../repositories/profileRepository.js";
import {App} from "../app.js";


export class profileController extends Controller {
    #createProfileView
    #profileRepository
    #data
    #app
    /**
     * Constructs a new profileController instance.
     */
    constructor() {
        super();
        this.#profileRepository = new profileRepository()
        this.#setupView();
    }

    /**
     * Sets up the profile view by loading the HTML content and fetching user data.
     * @private
     */
    async #setupView() {
        this.#createProfileView = await super.loadHtmlIntoContent("html_views/profile.html")
        await this.#fetchUserData(1);
        document.getElementById("buttonWijzig").addEventListener("click", (event) => App.loadController(App.CONTROLLER_EDITPROFILE));
        await this.#setProfileImage()
        await this.#setupActivities()
    }

    /**
     * Fetches user data from the repository and displays it on the profile view.
     * @param {number} userId - The ID of the user whose data is being fetched.
     @private
     */
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
    /**
     * Calculates the age of the user based on their date of birth.
     * @param {string} dateOfBirth - The date of birth of the user.
     * @returns {number} The age of the user in years.
     * @private
     */
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
    /**
     * Sets the profile image for the user from local storage.
     * @private
     */
    async #setProfileImage() {
        const url = localStorage.getItem("profile-image")
        const img = document.getElementById("profileImage")
        img.src = url;
    }

    async #setupActivities() {
        // Constant we are gonna use
        const cardContainer = document.getElementById('card-container');
        const activityTitle = 'Activiteit';
        const activityAmount = 'Hoeveelheid / hoelang';
        const usergoalID = 4;

        // This is the layout of every card, it will be filled with the constants of the parameters
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
    <div class="card w-50 mx-auto my-5">
      <div class="card-body justify-content-center text-center">
        <h5 id="activity-title" class="card-title">${activityTitle}</h5>
        <h6 id="activity-amount" class="card-subtitle mb-2 text-muted">${activityAmount}</h6>
        <div class="btn-group-sm" data-toggle="buttons">
          <button id="activity-btn-completed" class="btn-primary mx-lg-2 w-25">Gehaald</button>
          <button id="activity-btm-notCompleted" class="btn-secondary  w-25">Niet gehaald</button>
        </div>
      </div>
    </div>`;
        // When button is pressed it will now only log the usergoalID but it will in the future run a function and use usergoalID as a parameter
        card.querySelector('#activity-btn-completed').addEventListener('click', () => {
            console.log(usergoalID);
        });
        cardContainer.appendChild(card);
    }
}

