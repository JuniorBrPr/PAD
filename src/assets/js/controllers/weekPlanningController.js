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

    async #handleWeekplanning() {
       // event.preventDefault();
        console.log("hoi")



        let containerDayBox = document.querySelector("#dayContainer");

        let today = new Date(); //Dag vandaag
        let dateToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // Begint bij maandag (- today.getDay() + 1)  => weghaalt, krijg je dag van vandaag



        let deleteButtonPlanning = document.querySelector(".deleteButtonPlanning");
        let completeButtonPlanning = document.querySelector(".completeButtonPlanning");

        for (let i = 0; i < 7; i++) {
            /**Boxen*/
            let newContainerTest = document.createElement('div');
            newContainerTest.classList.add('containerDiv');
            newContainerTest.id = `container-${i}`;
            containerDayBox.appendChild(newContainerTest);

            /**Datums*/
            let date = new Date(dateToday);
            date.setDate(dateToday.getDate() + i);
            let dayDiv = document.createElement("div");
            dayDiv.innerHTML = date.toDateString(); //toont de dagen

            /**Buttons*/
            // let buttonDiv = document.createElement('div');
            // buttonDiv.classList.add('deleteButtonPlanning');



            newContainerTest.appendChild(dayDiv)//Voegt de datums in de boxen
            // newContainerTest.appendChild(deleteButtonPlanning)

                }










    }
}