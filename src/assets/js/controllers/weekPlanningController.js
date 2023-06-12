/**
 * Controller weekplanning
 * @author Hanan Ouardi
 */

import {Controller} from "./controller.js";
import {WeekPlanningRepository} from "../repositories/weekPlanningRepository.js";

export class WeekPlanningController extends Controller {
    #planningView
    #weekPlanningRepository

    constructor() {
        super();
        this.#weekPlanningRepository = new WeekPlanningRepository();
        this.#setupViewPlanning()
    }

    /**
     * Sets up the view for week planning by loading the HTML content, attaching event listeners to relevant elements,
     * and calling the appropriate handler functions.
     *
     * @author Hanan Ouardi
     */
    async #setupViewPlanning() {
        this.#planningView = await super.loadHtmlIntoContent("html_views/weekPlanning.html")

        this.#planningView.querySelector(".deleteButtonPlanning").addEventListener("click",
            (event) => this.#handleWeekplanning(event));
        this.#planningView.querySelector(".completeButtonPlanning").addEventListener("click",
            (event) => this.#handleWeekplanning(event));

        this.#handleWeekplanning();

    }

    /**
     * Handles the week planning by setting up the view with day boxes, activities, and buttons for each day of the week.
     *
     * @throws {Error} If an error occurs while handling the week planning.
     *
     * @author Hanan Ouardi
     */
    async #handleWeekplanning() {
        let containerDayBox = document.querySelector("#dayContainer");
        let today = new Date(); //Dag vandaag
        let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Begint bij maandag (- today.getDay() + 1)  => weghaalt, krijg je dag van vandaag
        const deleteButtonPlanning = document.querySelector(".deleteButtonPlanning");
        const completeButtonPlanning = document.querySelector(".completeButtonPlanning");

        //Loopt door alle dagen van de week
        for (let i = 0; i < 7; i++) {
            const data = await this.#weekPlanningRepository.userActivities();
            //code makes sure dataArray always has an array (existing or not existing)
            const dataArray = Array.isArray(data.data) ? data.data : [data.data]; //checks data is array - if not [data.data] create new array met data.data
            //filters dataArray based on dayOfTheWeek value and create new array goals.
            const goals = dataArray.filter(item => item.dayOfTheWeek === i + 1); //item is each element of dataArray, dayOfTheWeek match current day

            const cloneButtonDelete = deleteButtonPlanning.cloneNode(true);
            const cloneButtonComplete = completeButtonPlanning.cloneNode(true);
            //  Verwijdert de orinal html button
            deleteButtonPlanning.remove();
            completeButtonPlanning.remove();

            //Boxen aangemaakt
            let dayBoxesOfTheWeek = this.#creatElement('containerDiv');
            let dayActivity = document.createElement('div');
            dayActivity.classList.add('dayActivity');

            if (goals.length > 0) {
                // Haal de gewenste waarde op en koppel deze aan dayBoxesOfTheWeek
                dayActivity.innerHTML = goals.dayOfTheWeek;
                const activities = goals.map(goal => `${goal.valueChosenByUser} ${goal.unit} ${goal.name}`).join("<br>");
                dayActivity.innerHTML = `${dayBoxesOfTheWeek.innerHTML} - ${activities}`;
            } else {
                // If no goal is found, display "No activity today"
                dayActivity.innerHTML = `${dayBoxesOfTheWeek.innerHTML}  Geen activiteit voor vandaag`;
                cloneButtonComplete.style.display = "none";
                cloneButtonDelete.style.display = "none";
            }

            //Box toegevoegd
            containerDayBox.appendChild(dayBoxesOfTheWeek);
            //Datums aan box toegevoegd
            dayBoxesOfTheWeek.appendChild(this.#formatDate(dateToday, i, today));
            // Buttons in box toegevoegd
            dayBoxesOfTheWeek.appendChild(cloneButtonDelete);
            dayBoxesOfTheWeek.appendChild(cloneButtonComplete);
            //data aan box toegevoegd
            dayBoxesOfTheWeek.appendChild(dayActivity);

            cloneButtonComplete.addEventListener("click", async function () {
                try {
                    // Retrieve necessary data from the goals array
                    const userId = goals[0].userId; // Assuming userId is the same for all goals on a specific day
                    const userActivityId = goals.map(goal => goal.id);
                    const completed = true;

                    // Format the selected date to the required format
                    const selectedDateObj = getDateOfSelectedDay(i)
                    const year = selectedDateObj.getFullYear();
                    const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0'); //month from 1-12 -
                    const day = String(selectedDateObj.getDate()).padStart(2, '0');
                    const selectedDate = `${year}-${month}-${day}`;

                    // Call the userCompletedActivity method from the weekPlanningRepository
                    await this.#weekPlanningRepository.userCompletedActivity(userId, completed, selectedDate, userActivityId);
                    this.#handleSuccess();
                } catch (e) {
                    this.#handleError();
                }
            }.bind(this)); //allow access properties and methods within the function
            cloneButtonDelete.addEventListener("click", async function () {
                window.alert("helaas")
            });


            /**
             * function takes an index representing a day within the week begin at Sunday
             * Returns the corresponding Date object for that day in the current week.
             * @param dayIndex
             * @returns {Date}
             *
             * @author Hanan Ouardi
             */
            function getDateOfSelectedDay(dayIndex) {
                const selectedDate = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() - dateToday.getDay() + 1 + dayIndex);
                return selectedDate;
            }


            const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};

            let nextWeek = document.querySelector("#nextWeekPlanning");
            let lastWeek = document.querySelector("#lastWeekPlanning");
            nextWeek.addEventListener("click", () => {
                i++;
                this.#weekFunction(i, options)
            });
            lastWeek.addEventListener('click', () => {
                i--;
                this.#weekFunction(i, options)
            });
        }
    }

    /**
     * Displays a success message in the success container and provides an OK button to dismiss the message.
     *
     * @author Hanan Ouardi
     */
    #handleSuccess() {
        const validBox = document.querySelector("#succesContainer");
        const succesAlert = document.createElement('div');
        succesAlert.classList.add('alert', 'alert-success');
        succesAlert.setAttribute('role', 'alert');
        succesAlert.textContent = 'Goed gedaan! ' +
            'U heeft de activiteiten succesvol afgerond';

        const okButton = document.createElement('button');
        okButton.classList.add('btn', 'btn-primary');
        okButton.textContent = 'OK';
        okButton.addEventListener('click', function () {
            validBox.removeChild(succesAlert);
        });
        succesAlert.appendChild(okButton);
        validBox.innerHTML = '';
        validBox.appendChild(succesAlert);
    }

    /**
     * Displays an error message in the info container and provides an OK button to dismiss the message.
     *
     * @author Hanan Ouardi
     */
    #handleError() {
        const infoBox = document.querySelector("#infoContainer");
        const infoAlert = document.createElement('div');
        infoAlert.classList.add('alert', 'alert-dark');
        infoAlert.setAttribute('role', 'alert');
        infoAlert.textContent = 'Er is iets mis gegaan! U kunt het opnieuw proberen';
        const okButton = document.createElement('button');
        okButton.classList.add('btn', 'btn-primary');
        okButton.textContent = 'OK';
        okButton.addEventListener('click', function () {
            infoBox.removeChild(infoAlert);
        });
        infoAlert.appendChild(okButton);
        infoBox.innerHTML = '';
        infoBox.appendChild(infoAlert);
    }


    /**
     * Formats a date object and returns the formatted date element.
     * @param {Date} dateObj - The date object to format.
     * @param {number} index - The index value used for date manipulation.
     * @param {Date} today - The current date object.
     * @returns {HTMLElement} - The formatted date element.
     *
     * @author Hanan Ouardi
     */
    #formatDate(dateObj, index, today) {
        // Datums geformatteerd
        let date = new Date(dateObj);
        date.setDate(dateObj.getDate() + index);
        let datePlanningDiv = this.#creatElement('dateplanningDiv')
        const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
        if (date.toDateString() === today.toDateString()) { // check if date is today
            datePlanningDiv.innerHTML = `<strong>${date.toLocaleDateString('nl', options)}</strong>`;
        } else {
            datePlanningDiv.innerHTML = date.toLocaleDateString('nl', options);
        }
        return datePlanningDiv;
    }

    /**
     * Creates and returns a new HTML div element with the specified class name.
     * @param {string} divName - The class name to be added to the div element.
     * @returns {HTMLElement} - The newly created div element.
     *
     * @author Hanan Ouardi
     */
    #creatElement(divName) {
        let element = document.createElement("div");
        element.classList.add(divName);
        return element;
    }

    /**
     * Updates the date elements with the data of the next week.
     * @param {number} i - The index value representing the number of weeks in the future.
     * @param {Object} options - The options object for date formatting.
     *
     * @author Hanan Ouardi
     */
    #weekFunction(i, options) {
        let dateElements = document.querySelectorAll(".dateplanningDiv");
        let today = new Date();
        // numbers van de weken in de toekomst
        let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1 + (7 * i) - 49);
        dateToday.setDate(dateToday.getDate() + 7);
        //loop door alle data elements en updates het met de data van volgende week.
        dateElements.forEach(function (dateElement, index) {
            let date = new Date(dateToday);
            date.setDate(date.getDate() + index);
            dateElement.innerHTML = date.toLocaleDateString('nl', options);
        });
    }


}




