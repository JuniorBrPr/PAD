/**
 * Controller weekplanning
 * @author Hanan Ouardi
 */

import {Controller} from "./controller.js";
import {App} from "../app.js";
import {WeekPlanningRepository} from "../repositories/weekPlanningRepository.js";

export class WeekPlanningController extends Controller {
    #planningView
    #weekPlanningRepository
    #data
    #app

    constructor() {
        super();
        this.#weekPlanningRepository = new WeekPlanningRepository();
        this.#setupViewPlanning()
    }

    async #setupViewPlanning() {
        this.#planningView = await super.loadHtmlIntoContent("html_views/weekPlanning.html")

        this.#planningView.querySelector(".deleteButtonPlanning").addEventListener("click",
            (event) => this.#handleWeekplanning(event));
        this.#planningView.querySelector(".completeButtonPlanning").addEventListener("click",
            (event) => this.#handleWeekplanning(event));


        //this.#planningView.addEventListener("click", event => this.#handleWeekplanning(event));
        this.#handleWeekplanning();

    }

    /**
     * Doel:
     * @returns {Promise<void>}
     */
    async #handleWeekplanning(data) {
        // event.preventDefault();
        let containerDayBox = document.querySelector("#dayContainer");
        let today = new Date(); //Dag vandaag
        let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Begint bij maandag (- today.getDay() + 1)  => weghaalt, krijg je dag van vandaag

        let deleteButtonPlanning = document.querySelector(".deleteButtonPlanning");
        let completeButtonPlanning = document.querySelector(".completeButtonPlanning");



        //Loopt door alle dagen van de week
        for (let i = 0; i < 7; i++) {
            const data = await this.#weekPlanningRepository.userActivities();
            const dataArray = Array.isArray(data.data) ? data.data : [data.data];
            //Boxen aangemaakt
            let dayBoxesOfTheWeek = this.#creatElement('containerDiv');
            let dayActivity = document.createElement('div');
            dayActivity.classList.add('dayActivity');

            const goals = dataArray.filter(item => item.dayOfTheWeek === i + 1);
            // Controleer of er een overeenkomend item in de fetched data is gevonden
            if (goals.length > 0) {
                // Haal de gewenste waarde op en koppel deze aan dayBoxesOfTheWeek
                dayActivity.innerHTML = goals.dayOfTheWeek;
                const activities = goals.map(goal => `${goal.valueChosenByUser} ${goal.unit} ${goal.name}`).join("<br>");
                dayActivity.innerHTML = `${dayBoxesOfTheWeek.innerHTML} - ${activities}`;


            } else {
                // If no goal is found, display "No activity today"
                dayActivity.innerHTML = `${dayBoxesOfTheWeek.innerHTML}  Geen activiteit voor vandaag`
            }

            //Box toegevoegd
            containerDayBox.appendChild(dayBoxesOfTheWeek);

            //Buttons
            let cloneButtonDelete = deleteButtonPlanning.cloneNode(true);
            let cloneButtonComplete = completeButtonPlanning.cloneNode(true);

            //Verwijdert de orinal html button
            deleteButtonPlanning.remove();
            completeButtonPlanning.remove();

            //Datums aan box toegevoegd
            dayBoxesOfTheWeek.appendChild(this.#formatDate(dateToday, i, today));

            //data aan box toegevoegd
            dayBoxesOfTheWeek.appendChild(dayActivity);


                //Buttons in box toegevoegd
                dayBoxesOfTheWeek.appendChild(cloneButtonDelete);
                dayBoxesOfTheWeek.appendChild(cloneButtonComplete);


                //#sendFinished(deleteButtonPlanning, completeButtonPlanning, date) {
            //    Buttons
            //     let cloneButtonDelete = deleteButtonPlanning.cloneNode(true);
            //     let cloneButtonComplete = completeButtonPlanning.cloneNode(true);
                //Put the data if the user completed it with the date
                // let selectedDate = date.toLocaleDateString();


                cloneButtonComplete.addEventListener("click", async function () {

                    //  this.#formatDate(dateObj, i, today);
                    try {
                        const dataTest = await this.#weekPlanningRepository.userActivities();
                        console.log(dataTest)
                        const dataArray = Array.isArray(data.data) ? data.data : [data.data];

                        const goals = dataArray.filter(item => item.dayOfTheWeek === i + 1);

                        const userId = goals[0].userId; // Assuming userId is the same for all goals on a specific day
                        console.log(userId);

                        const userActivityId = goals.map(goal => goal.id);
                        console.log(userActivityId)

                        const completed = true;
                        console.log(completed)

                        const selectedDateObj = getDateOfSelectedDay(i)
                        const year = selectedDateObj.getFullYear();
                        const month = String(selectedDateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1 and pad with leading zero if necessary
                        const day = String(selectedDateObj.getDate()).padStart(2, '0'); // Pad with leading zero if necessary
                        const selectedDate = `${year}-${month}-${day}`;
                        console.log(selectedDate)

                        const resp = await this.#weekPlanningRepository.userCompletedActivity(userId, completed, selectedDate, userActivityId);
                        console.log(resp)

                        // await this.#weekPlanningRepository.userCompletedActivity(userGoalID, selectedDate, completed)

                        window.alert("U heeft de activiteit succesvol afgerond van: " + selectedDate);
                    } catch (e) {
                        window.alert("Er is iets misgegaan, probeer het opnieuw!");
                        console.log(e)
                    }
                }.bind(this));


                function getDateOfSelectedDay(dayIndex) {
                    const selectedDate = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() - dateToday.getDay() + 1 + dayIndex);
                    return selectedDate;
                }

                cloneButtonDelete.addEventListener("click", async function () {
                    window.alert("Niet afgemaakt!");
                });






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
     * Doel: Makes the date of today strong
     * @author Hanan Ouardi
     * @param dateObj
     * @param index
     * @param today
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
     * Doel: Create a div that can be re-used
     * @author Hanan Ouardi
     * @param divName
     * @param type
     * @returns {HTMLDivElement}
     */
    #creatElement(divName) {
        let element = document.createElement("div");
        element.classList.add(divName);
        return element;
    }

    /**
     * Doel: returns the date of last and next weeks
     * @author Hanan Ouardi
     * @param i
     * @param options
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

    /**
     * Functie: om naar database te sturen als het (on)afgerond met datum.
     */








}




