window.onload(disableBtn());

function disableBtn(){
    document.getElementById("testKnopje").disabled=true;
}

// //const values of average daily excersize time in mins
// const lowValue = 15;
// const averageValue = 30;
// const mediumValue = 60;
// const highValue = 90;
//
// //const values of days per week
// let day = [];
// day[1] = 'monday', day[2] = 'tuesday', day[3] = 'wednesday';
// day[4] = 'thursday', day[5] = 'friday', day[6] = 'saturday', day[7] = 'sunday';

//function that puts the right time values in the html
function setRightValues() {

    //sets the right questionn in html
    Document.getElementByID("question").value = #getActivityFrequency;

    //need to use the question retrieved from the database in ActivityFrequencyRoute
    Document.getElementByID("maandag").value = lowValue;
    Document.getElementByID("dinsdag").value = averageValue;
    Document.getElementByID("option3").value = mediumValue;
    Document.getElementByID("option4").value = highValue;
}

setRightValues();

//creates checkboxes for the possible days
let divje = document.getElementById("divje");

let checkbox = document.createElement('input');

checkbox.type = ("checkbox");

for (let i = 0; day[1 + i]; i++) {
    checkbox.name = ("daysCheckbox" + i);
    checkbox.value = day[i];
}

var label = document.createElement('label');

label.htmlFor = "id";

label.appendChild(document.createTextNode('activity checkboxes'));
divje.appendChild(checkbox);
divje.appendChild(label);

//function that counts the total of excersized days, this total needs to be sent to the database
// function countTotalDaysExcersized() {
//     let totalDaysExcersized;
//
//     for (let i = 0; day[1 + i]; i++) {
//         if (checkbox.checked === true) {
//             totalDaysExcersized++;
//         }
//     }
// }