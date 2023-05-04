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

        //Voor nu hardcoded, ga het later aanpassen
        let dataToDoDay = [{
            id: 1,
            name: 'Sport',
            type: 'hardlopen',
            tijd: '10min',
            kcal: '100 - 200kcal',
        }]


        //Loopt door alle dagen van de week
        for (let i = 0; i < 7; i++) {
            //Boxen aangemaakt
            // let newContainerTest1 = newContainerTest.cloneNode(true);
            // newContainerTest.remove();

            let newContainerTest = document.createElement('div');
            newContainerTest.classList.add('containerDiv');


            //Data in boxen testen met hardcoded
            let dayActivity = document.createElement('div');
            dayActivity.classList.add('dayActivity');
            dayActivity.innerHTML = dataToDoDay[0].type + dataToDoDay[0].name;

            //Box toegevoegd
            containerDayBox.appendChild(newContainerTest);


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
            newContainerTest.appendChild(datePlanningDiv)//Voegt de datums in de boxen
            //data aan box toegevoegd
            newContainerTest.appendChild(dayActivity);
            //Buttons in box toegevoegd*/
            newContainerTest.appendChild(cloneButtonDelete);
            newContainerTest.appendChild(cloneButtonComplete);



            /**Next week Button*/
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
            /**Last week button*/
            let lastWeek = document.querySelector("#lastWeekPlanning");
            lastWeek.addEventListener("click", function(){
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