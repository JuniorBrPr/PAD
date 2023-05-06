/**
 * Controller weekplanning
 * @author Hanan Ouardi
 */

import {Controller} from "./controller.js";

import {App} from "../app.js";


export class WeekPlanningController extends Controller {

    #planningView

    constructor() {
        super();

        this.#setupViewPlanning()
    }

    async #setupViewPlanning() {
        this.#planningView = await super.loadHtmlIntoContent("html_views/weekPlanning.html")

        //this.#planningView.addEventListener("click", event => this.#handleWeekplanning(event));
        this.#handleWeekplanning();
    }

    /**
     * @author Hanan Ouardi
     * @returns {Promise<void>}
     */
    async #handleWeekplanning() {
        // event.preventDefault();
        let containerDayBox = document.querySelector("#dayContainer");
        let today = new Date(); //Dag vandaag
        let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Begint bij maandag (- today.getDay() + 1)  => weghaalt, krijg je dag van vandaag

        // let newContainerTest = document.querySelector(".newContainerTest");
        let deleteButtonPlanning = document.querySelector(".deleteButtonPlanning");
        let completeButtonPlanning = document.querySelector(".completeButtonPlanning");

        // let newContainerTest1 = dayBoxesOfTheWeek.cloneNode(true);
        // dayBoxesOfTheWeek.remove();

        //Voor nu hardcoded, ga het later aanpassen
        let dataToDoDay = [{
            id: 1,
            name: 'Sport',
            type: 'hardlopen',
            tijd: '10min',
            kcal: '100 - 200kcal',
        },
            {
                id: 2,
                name: 'eten',
                type: 'Fietsen',
                tijd: '10min',
                kcal: '100 - 200kcal',
            }]


        //Loopt door alle dagen van de week
        for (let i = 0; i < 7; i++) {
            //Boxen aangemaakt
            let dayBoxesOfTheWeek = document.createElement('div');
            dayBoxesOfTheWeek.classList.add('containerDiv');

            /**Hardcode data**/
            //Data in boxen testen met hardcoded
            let dayActivity = document.createElement('div');
            dayActivity.classList.add('dayActivity');

            /**For each dataToDotoday another activity*/
            // Set the innerHTML of the second dayActivity element to 'Sport'
            if (i === 0) {
                dayActivity.innerHTML = dataToDoDay[0].type; // Set the 'Sport' data
            }
            // Set the innerHTML of the second dayActivity element to 'Eten'
            else if (i === 1) {
                dayActivity.innerHTML = dataToDoDay[1].type; // Set the 'Eten' data
            } else if (i === 2) {
                dayActivity.innerHTML = dataToDoDay[0].type; // Set the 'Eten' data
            } else if (i === 3) {
                dayActivity.innerHTML = dataToDoDay[0].type; // Set the 'Eten' data
            } else if (i === 4) {
                dayActivity.innerHTML = dataToDoDay[1].type; // Set the 'Eten' data
            } else if (i === 5) {
                dayActivity.innerHTML = dataToDoDay[0].type; // Set the 'Eten' data
            } else if (i === 6) {
                dayActivity.innerHTML = dataToDoDay[1].type; // Set the 'Eten' data
            }


            //Box toegevoegd
            containerDayBox.appendChild(dayBoxesOfTheWeek);
            //Datums geformatteerd
            let date = new Date(dateToday);
            date.setDate(dateToday.getDate() + i);
            let datePlanningDiv = document.createElement("div");
            datePlanningDiv.classList.add('dateplanningDiv');
            const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
            datePlanningDiv.innerHTML = date.toLocaleDateString('nl', options); //toont de dagen


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
                    const options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
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


        }


    }
}


/**Popup maken*/
// dayActivity.addEventListener("click", function(){
//      window.alert("tes123");
//
//  });