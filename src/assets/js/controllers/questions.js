

//Question voor nu hardcoded || veranderen naar => ophalen uit database
const Question = [
    {
    id: 0,
    q: "hoe lang .....",
    a: [{text: "h"}, {text: "j"}, {text: "k"}, {text: "s"}]
},
    {
        id: 1,
        q: "Wat is  .....",
        a: [{text: "a"}, {text: "b"}, {text: "c"}, {text: "d"}]
    }
]

let start = true;

function test_a(id){
    //get the question
    const question = document.querySelector("#question");
    //set the question
    question.innerText = Question[id].q;
   // get the options
    const opt1 = document.querySelector("#option1");
    const opt2 = document.querySelector("#option2");
    const opt3 = document.querySelector("#option3");
    const opt4 = document.querySelector("#option4");

    opt1.innerText = Question[id].a[0].text;
    opt2.innerText = Question[id].a[1].text;
    opt3.innerText = Question[id].a[2].text;
    opt4.innerText = Question[id].a[3].text;


}

if(start) {
    test_a("0");
}
const next = document.getElementById("next");
let id = 0;

next.addEventListener("click", () => {
    if(id < 1){
        id++;
        test_a(id)
        console.log(id);
    }
})