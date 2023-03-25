
import {Controller} from "./controller.js";

export class questionsController extends Controller {
    #createVagenlijstView;

    constructor(){
        super();
        this.#setupView();
    }

    async #setupView(){
        this.#createVagenlijstView = await super.loadHtmlIntoContent("html_views/questions.html")
        //  this.#functionQuestions(await this.)




    }

    #functionQuestions(data) {

    }
}


// const form = document.getElementById('question-form');
//
// // Add an event listener for form submission
// form.addEventListener('submit', function(event) {
//     // Prevent the default form submission behavior
//     event.preventDefault();
//
//     // Get the value of the question input
//     const questionInput = document.getElementById('question-input');
//     const question = questionInput.value;
//
//     // Send the question to the server using fetch()
//     fetch('/ask-question', {
//         method: 'POST',
//         body: JSON.stringify({ question: question }),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(data) {
//             // Display the questions on the page
//             const questionList = document.getElementById('question-list');
//             data.forEach(function(question) {
//                 const questionItem = document.createElement('li');
//                 questionItem.textContent = question.text;
//                 questionList.appendChild(questionItem);
//             });
//         })
//         .catch(function(error) {
//             console.error(error);
//         });
//
//     // Reset the form
//     form.reset();
//
//});








































//Question voor nu hardcoded || veranderen naar => ophalen uit database
// const Question = [
//     {
//     id: 0,
//     q: "hoe lang .....",
//     a: [{text: "h"}, {text: "j"}, {text: "k"}, {text: "s"}]
// },
//     {
//         id: 1,
//         q: "Wat is  .....",
//         a: [{text: "a"}, {text: "b"}, {text: "c"}, {text: "d"}]
//     }
// ]
//
// let start = true;
//
// function test_a(id){
//     //get the question
//     const question = document.querySelector("#question");
//     //set the question
//     question.innerText = Question[id].q;
//    // get the options
//     const opt1 = document.querySelector("#option1");
//     const opt2 = document.querySelector("#option2");
//     const opt3 = document.querySelector("#option3");
//     const opt4 = document.querySelector("#option4");
//
//     opt1.innerText = Question[id].a[0].text;
//     opt2.innerText = Question[id].a[1].text;
//     opt3.innerText = Question[id].a[2].text;
//     opt4.innerText = Question[id].a[3].text;
//
//
// }
//
// if(start) {
//     test_a("0");
// }
// const next = document.getElementById("next");
// let id = 0;
//
// next.addEventListener("click", () => {
//     if(id < 1){
//         id++;
//         test_a(id)
//         console.log(id);
//     }
// })