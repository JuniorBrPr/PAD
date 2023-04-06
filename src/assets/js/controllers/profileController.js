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
        await this.#setupGoals(1)
        await this.#displayGoalCompletionPercentage(1)
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

    async #setupGoals(userId) {
        const cardContainer = document.getElementById('card-container');
        try {
            let goals = await this.#profileRepository.getGoals(userId);
            for (let i = 0; i < goals.data.length; i++) {
                let goals = await this.#profileRepository.getGoals(userId);
                // Constant we are gonna use
                let goalTitle = goals.data[i].name;
                let goalAmount = goals.data[i].value;
                let valueType = goals.data[i].valueType
                let usergoalID = goals.data[i].usergoalID;

                // This is the layout of every card, it will be filled with the constants of the parameters
                let card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
    <div class="card w-50 mx-auto my-5">
      <div class="card-body justify-content-center text-center">
        <h5 id="activity-title" class="card-title">${goalTitle}</h5>
        <h6 id="activity-amount" class="card-subtitle mb-2 text-muted">${goalAmount} ${valueType}</h6>
        <div class="btn-group-sm" data-toggle="buttons">
          <button id="activity-btn-completed" class="btn-primary mx-lg-2 w-25">Gehaald</button>
          <button id="activity-btm-notCompleted" class="btn-secondary  w-25">Niet gehaald</button>
        </div>
      </div>
    </div>`;
                // When button is pressed it will now only log the usergoalID but it will in the future run a function and use usergoalID as a parameter
                card.querySelector('#activity-btn-completed').addEventListener('click', async () => {
                    await this.#profileRepository.updateGoalCompletion(usergoalID);
                    card.style.opacity = '0'; // Set opacity to 0 to start the transition
                    card.style.transition = 'opacity 0.3s ease-in-out'; // CSS transition for opacity with ease-in-out timing function
                    setTimeout(() => {
                        cardContainer.removeChild(card); // Remove the element from the DOM after the transition is complete
                    }, 300); // Use the same duration as the CSS transition (0.3s) for setTimeout
                    await this.#displayGoalCompletionPercentage(userId) // Update goalcompletionpercentage
                });
                cardContainer.appendChild(card);
            }
        } catch(e){
            console.log(e)
        }
    }


    async #displayGoalCompletionPercentage(userId) {
        let calculateGoalCompletionPercentage = await this.#profileRepository.calculateGoalCompletionPercentage(userId);
        const percentageText = document.getElementById('percentage');
        let percentageGoalCompletion = calculateGoalCompletionPercentage.data[0].percentage;

        // Text percentage
        percentageText.innerHTML = percentageGoalCompletion + "%";

        // Get the percentage bar element
        const percentageBar = document.getElementById("percentageBar");

        // Update the width of the percentage bar based on the percentage value
        function updatePercentageBar() {
            percentageBar.style.width = `${percentageGoalCompletion}%`;
            percentageBar.style.transition = '2s ease-in-out'; // CSS transition for opacity with ease-in-out timing function
        }

        // Call the updatePercentageBar function initially to set the initial percentage value
        updatePercentageBar();
    }


}

