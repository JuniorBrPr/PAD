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
     * @author Hanan Ouardi
     * @returns {Promise<void>}
     */
    async #handleWeekplanning(id, event, datePlanningDiv) {

        const validBox = this.#planningView.querySelector(".valid-feedback");
        const invalidBox = this.#planningView.querySelector(".invalid-feedback");

        // event.preventDefault();
        let containerDayBox = document.querySelector("#dayContainer");
        let today = new Date(); //Dag vandaag
        let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Begint bij maandag (- today.getDay() + 1)  => weghaalt, krijg je dag van vandaag

        // let newContainerTest = document.querySelector(".newContainerTest");
        let deleteButtonPlanning = document.querySelector(".deleteButtonPlanning");
        let completeButtonPlanning = document.querySelector(".completeButtonPlanning");


        //Loopt door alle dagen van de week
        for (let i = 0; i < 7; i++) {
            //  const validBox = this.#planningView.querySelector(".valid-feedback");
            //Boxen aangemaakt
            let dayBoxesOfTheWeek = document.createElement('div');
            dayBoxesOfTheWeek.classList.add('containerDiv');

            let dayActivity = document.createElement('div');
            dayActivity.classList.add('dayActivity');

            //For each dataToDotoday another activity
            const data = await this.#weekPlanningRepository.dataWeekPlanning(id)
            if (i === 0) {
                dayActivity.innerHTML = data[0].name;
            } else if (i === 1) {
                dayActivity.innerHTML = data[1].name;
            } else if (i === 2) {
                dayActivity.innerHTML = data[2].name;
            } else if (i === 3) {
                dayActivity.innerHTML = data[3].name;
            } else if (i === 4) {
                dayActivity.innerHTML = data[4].name;
            } else if (i === 5) {
                dayActivity.innerHTML = data[5].name;
            } else if (i === 6) {
                dayActivity.innerHTML = data[6].name;
            }


            //Box toegevoegd
            containerDayBox.appendChild(dayBoxesOfTheWeek);
            //Datums geformatteerd
            let date = new Date(dateToday);
            date.setDate(dateToday.getDate() + i);
            let datePlanningDiv = document.createElement("div");
            datePlanningDiv.classList.add('dateplanningDiv');
            const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
            if (date.toDateString() === today.toDateString()) { // check if date is today
                datePlanningDiv.innerHTML = '<strong>' + date.toLocaleDateString('nl', options) + '</strong>';
            } else {
                datePlanningDiv.innerHTML = date.toLocaleDateString('nl', options);
            }
            document.body.appendChild(datePlanningDiv);

           // datePlanningDiv.innerHTML = date.toLocaleDateString('nl', options); //toont de dagen

            //Buttons
            let cloneButtonDelete = deleteButtonPlanning.cloneNode(true);
            let cloneButtonComplete = completeButtonPlanning.cloneNode(true);
            //Verwijdert de orinal html button
            deleteButtonPlanning.remove();
            completeButtonPlanning.remove();
            //Datums aan box toegevoegd
            dayBoxesOfTheWeek.appendChild(datePlanningDiv)//Voegt de datums in de boxen
            /**data aan box toegevoegd*/
            dayBoxesOfTheWeek.appendChild(dayActivity);
            //Buttons in box toegevoegd*/
            dayBoxesOfTheWeek.appendChild(cloneButtonDelete);
            dayBoxesOfTheWeek.appendChild(cloneButtonComplete);


            //Next week Button
            let nextWeek = document.querySelector("#nextWeekPlanning");
            nextWeek.addEventListener("click", function () {
                //Alle data elements
                let dateElements = document.querySelectorAll(".dateplanningDiv");
                i++;
                // datum van volgende week
                let today = new Date();
                // numbers van de weken in de toekomst
                let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1 + (7 * i) - 49);
                dateToday.setDate(dateToday.getDate() + 7);
                //loop door alle data elements en updates het met de data van volgende week.
                dateElements.forEach(function (dateElement, index) {
                    let date = new Date(dateToday);
                    date.setDate(date.getDate() + index);
                    //const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
                     dateElement.innerHTML = date.toLocaleDateString('nl', options);
                });
            });
            //Last week button
            let lastWeek = document.querySelector("#lastWeekPlanning");
            lastWeek.addEventListener("click", function () {
                let dateElements = document.querySelectorAll(".dateplanningDiv");
                i--;
                let today = new Date();
                let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1 + (7 * i) - 49);
                dateToday.setDate(dateToday.getDate() + 7);

                dateElements.forEach(function (dateElement, index) {
                    let date = new Date(dateToday);
                    date.setDate(date.getDate() + index);
                    const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
                    dateElement.innerHTML = date.toLocaleDateString('nl', options);
                });
            });
            //Put the data if the user completed it with the date
            let selectedDate = date.toLocaleDateString();
            cloneButtonComplete.addEventListener("click", async function () {
                try {
                    const data = await this.#weekPlanningRepository.userWeekPlanning(selectedDate, true, false);
                    console.log(data);
                    // validBox.innerText = "U heeft de activiteit succesvol afgerond";
                    window.alert("U heeft de activiteit succesvol afgerond van: " + selectedDate);
                } catch (e) {
                    window.alert("Er is iets misgegaan, probeer het opnieuw!");
                    console.log(e)
                }
            }.bind(this));
            cloneButtonDelete.addEventListener("click", async function () {
                try {
                    const data = await this.#weekPlanningRepository.userWeekPlanning(selectedDate, false, true);
                    console.log(data);
                    // validBox.innerText = "U heeft de activiteit succesvol afgerond";
                    window.alert("U heeft de activiteit niet afgerond van: " + selectedDate);
                } catch (e) {
                    window.alert("Er is iets misgegaan, probeer het opnieuw!");
                    console.log(e)
                }
            }.bind(this));




        }

    }
}


