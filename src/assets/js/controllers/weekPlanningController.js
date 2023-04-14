/**
 * Controller weekplanning
 * @author Hanan Ouardi
 */

import {Controller} from "./controller.js";

import { App } from "../app.js";


export class WeekPlanningController extends Controller{

    #planningView

    constructor() {
        super();

        this.#setupViewPlanning()
    }

    async #setupViewPlanning(){
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
        let dateToday = new Date(today.getFullYear(), today.getMonth() , today.getDate() - today.getDay() + 1); // Begint bij maandag (- today.getDay() + 1)  => weghaalt, krijg je dag van vandaag

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

        /**Loopt door alle dagen van de week*/
        for (let i = 0; i < 7; i++) {
            /**Boxen aangemaakt*/
            let newContainerTest = document.createElement('div');
            newContainerTest.classList.add('containerDiv');
            newContainerTest.id = `${i}`;

            /**Data in boxen testen met hardcoded*/
            let dayActivity = document.createElement('div');
            dayActivity.classList.add('dayActivity');

            dayActivity.innerHTML = dataToDoDay[0].type + dataToDoDay[0].name;


            /**Box toegevoegd*/
            containerDayBox.appendChild(newContainerTest);


            /**Datums*/
            let date = new Date(dateToday);
            date.setDate(dateToday.getDate() + i);
            let datePlanningDiv = document.createElement("div");
            datePlanningDiv.classList.add('dateplanningDiv');
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            datePlanningDiv.innerHTML = date.toLocaleDateString('nl', options); //toont de dagen

            /**Buttons*/



            /**Datums aan box toegevoegd*/
            newContainerTest.appendChild(datePlanningDiv)//Voegt de datums in de boxen
            /**data aan box toegevoegd*/
            newContainerTest.appendChild(dayActivity);

            //newContainerTest.appendChild(deleteButtonPlanning)


            /**Popup maken*/
           dayActivity.addEventListener("click", function(){
                window.alert("tes123");
            });

                }









    }
}