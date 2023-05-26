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
        await this.#displayWeeklyGoalCompletion(1)
        await this.#setupGoals(1)
        await this.#displayDailyGoalCompletionPercentage(1)
    }

    /**
     * Fetches user data from the repository and displays it on the profile view.
     @private
     */
    async #fetchUserData() {
        try {
            const data = await this.#profileRepository.getData();
            document.getElementById("profileFullName").innerHTML = data.data[0].firstname + " " + data.data[0].surname
            document.getElementById("profileEmail").innerHTML = data.data[0].emailAddress
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

    async #setupGoals() {
        document.getElementById('date').innerHTML = new Date().toISOString().split('T')[0];
        document.getElementById("titleDoelen").innerHTML = 'U heeft geen doelen vandaag'; // Standard text
        try {
            let userGoals = await this.#profileRepository.getUserGoals();
            if (userGoals.data.length >= 1) {
                document.getElementById("titleDoelen").innerHTML = 'Uw doelen van vandaag'; // Update text if goals have been found
                for (let i = 0; i < userGoals.data.length; i++) {
                    let usergoal = userGoals.data[i]; // Store the current usergoal in a variable

                    // Clone the template
                    const template = document.getElementById('usergoalTemplate');
                    const clone = template.content.cloneNode(true);

                    // Set the values in the cloned template
                    clone.getElementById('activity-title').innerHTML = usergoal.name;
                    let value = usergoal.data[i]?.value || usergoal.valueChosenByUser;
                    clone.getElementById('activity-amount').innerHTML = value + " " + usergoal.unit;

                    // Handle button click
                    clone.querySelector("#activity-btn-completed").addEventListener("click", async () => {
                        let checkIfGoalExists = await this.#profileRepository.checkIfGoalExists(usergoal.usergoalID);
                        if (checkIfGoalExists.data[0].goalCount === 0) {
                            await this.#profileRepository.insertGoal(usergoal.usergoalID, value);
                        }
                        await this.#profileRepository.updateGoalCompletion(usergoal.usergoalID);
                        await this.#displayDailyGoalCompletionPercentage(); // Update daily goal completion percentage
                        await this.#displayWeeklyGoalCompletion(); // Update weekly goal completion percentage
                    });

                    document.getElementById('card-container').appendChild(clone);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }


    async #displayDailyGoalCompletionPercentage() {
        let calculateDailyGoalCompletionPercentage = await this.#profileRepository.calculateDailyGoalCompletionPercentage();
        const percentageText = document.getElementById('percentage');
        let percentageGoalCompletion = parseInt(calculateDailyGoalCompletionPercentage.data[0].percentage);
        // Text percentage
        percentageText.innerHTML = percentageGoalCompletion + "%"; // If there already is a goal then present percentage

        if (isNaN(percentageGoalCompletion)) { // If no goals exist
            percentageText.innerHTML = "0%"; // Set innertext to 0% of NaN%
        }

        function updatePercentageBar() {
            let circle = document.querySelector('circle');
            document.getElementById('progress-ring').style.display = 'block'
            let radius = circle.r.baseVal.value;
            let circumference = radius * 2 * Math.PI;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = `${circumference}`;

            const offset = circumference - percentageGoalCompletion / 100 * circumference;
            circle.style.strokeDashoffset = offset;

            if (percentageGoalCompletion === 100) {
                document.getElementById("titleDoelen").innerHTML = 'U heeft uw doel(en) behaald voor vandaag' // Standard text
            }
        }

        // Call the updatePercentageBar function initially to set the initial percentage value
        updatePercentageBar();
    }

    async #displayWeeklyGoalCompletion() {
        let data = await this.#profileRepository.calculateWeeklyGoalCompletionPercentage();
        let percentageWeeklyGoalCompletion = parseInt(data.data[0].percentage);
        let percentageBar = document.getElementById("progress-bar")

        function updateWeeklyPercentageBar() {
            percentageBar.innerHTML = `${percentageWeeklyGoalCompletion}%`;
            percentageBar.style.height = `${percentageWeeklyGoalCompletion}%`;

            if (isNaN(percentageWeeklyGoalCompletion)) {
                percentageBar.style.height = `0%`;
                percentageBar.innerHTML = `0%`;
            }
        }

        // Call the updatePercentageBar function initially to set the initial percentage value
        updateWeeklyPercentageBar();
    }
}

