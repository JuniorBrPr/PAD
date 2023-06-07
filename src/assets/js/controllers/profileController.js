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
        await this.#fetchUserData();
        document.getElementById("buttonWijzig").addEventListener("click", (event) => App.loadController(App.CONTROLLER_EDITPROFILE));
        await this.#displayWeeklyGoalCompletion()
        await this.#setupGoals()
        await this.#displayDailyGoalCompletionPercentage()
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

    /**
     * Sets up the goals by performing various operations such as updating the date, retrieving user goals,
     * populating the template with goal data, handling button clicks for goal completion, and updating
     * the daily and weekly goal completion percentages.
     */
    async #setupGoals() {
        document.getElementById('date').innerHTML = new Date().toISOString().split('T')[0];
        document.getElementById("titleDoelen").innerHTML = 'U heeft geen doelen vandaag'; // Standard text
        try {
            let userGoals = await this.#profileRepository.getUserGoals();
            if (userGoals.data.length >= 1) {
                document.getElementById("titleDoelen").innerHTML = 'Uw doelen van vandaag'; // Update text if goals have been found
                const self = this; // Store the correct 'this' context

                userGoals.data.forEach(usergoal => { // Use 'userGoals.data.forEach' to loop through the goals array
                    // Clone the template
                    const template = document.getElementById('usergoalTemplate');
                    const clone = template.content.cloneNode(true);

                    // Set the values in the cloned template
                    clone.getElementById('activity-title').innerHTML = usergoal.name;
                    let value = usergoal?.value || usergoal.valueChosenByUser;
                    clone.getElementById('activity-amount').innerHTML = value + " " + usergoal.unit;

                    // Handle button click
                    clone.querySelector("#activity-btn-completed").addEventListener("click", async (e) => {
                        try {
                            const checkIfGoalExists = await self.#profileRepository.checkIfGoalExists(usergoal.usergoalID);
                            if (checkIfGoalExists.data[0].goalCount === 0) {
                                await self.#profileRepository.insertGoal(usergoal.usergoalID, value);
                            } else {
                                await self.#profileRepository.updateGoalCompletion(usergoal.usergoalID);
                            }

                            document.getElementById('card-container').removeChild(e.target.parentElement);
                            await self.#displayDailyGoalCompletionPercentage(); // Update daily goal completion percentage
                            await self.#displayWeeklyGoalCompletion(); // Update weekly goal completion percentage
                        } catch (error) {
                            console.error('Error occurred while posting / updating goal:', error);
                        }
                    });

                    document.getElementById('card-container').appendChild(clone);
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     Displays the daily goal completion percentage on the webpage.
     Calls the #profileRepository.calculateDailyGoalCompletionPercentage function to get the percentage.
     If there is already a goal, the function presents the percentage.
     If no goals exist, the function sets the innertext to 0%.
     Calls the updatePercentageBar function initially to set the initial percentage value.
     */
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

    /**
     Updates the percentage bar based on the percentageGoalCompletion value.
     Calculates the circumference of the circle element and sets the strokeDasharray and strokeDashoffset properties
     to display the progress bar. If the percentageGoalCompletion is 100, the function changes the text of the
     "titleDoelen" element to indicate that the daily goal has been achieved.
     */
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

