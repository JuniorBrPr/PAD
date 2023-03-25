import {Controller} from "./controller.js";
import {editProfileRepository} from "../repositories/editProfileRepository.js";


export class editProfileController extends Controller {
    #createProfileEditView
    #editProfileRepository
    #data
    constructor() {
        super();
        this.#editProfileRepository = new editProfileRepository()
        this.#setupView();
    }

    async #setupView() {
        this.#createProfileEditView = await super.loadHtmlIntoContent("html_views/editProfile.html")
        document.getElementById("saveProfileBtn").addEventListener("click", (event) => this.#validateForm());
    }

    async #sendData(userId) {
        const firstname = document.getElementById("InputFirstname").value
        const surname = document.getElementById("InputSurname").value
        const email = document.getElementById("InputEmail").value
        const weight = document.getElementById("InputWeight").value
        const height = document.getElementById("InputHeight").value
        const age = document.getElementById("InputAge").value

        try {
            const data = await this.#editProfileRepository.sendData(firstname,surname,email,weight,height,age, userId)
        } catch (e){
            console.log("Er is iets fout gegaan", e)
        }
    }

    async #validateForm(){
        if(
        await this.#checkWeightOrHeight(document.getElementById("InputWeight").value) &&
        await this.#checkWeightOrHeight(document.getElementById("InputHeight").value) &&
        await this.#calculateMinBirthDay(document.getElementById("InputAge").value)
    ){
            if (confirm("Weet je zeker dat je je wijzigingen wilt opslaan?")) {
                await this.#sendData(1)
                // location.reload();
            }

        } else{
            console.log("NO GOOD")
        }

    }

    async #calculateMinBirthDay(inputDate){
        let today = new Date();
        let dob = new Date(inputDate)
        let ageDiff = today.getTime() - dob.getTime();
        let ageDate = new Date(ageDiff);
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 18 || age > 100) {
            alert("You must be between 18 and 100 years old to use this service.");
            return false;
        }
        return true;
    }

    async #checkWeightOrHeight(inputValue) {
        // Replace comma with dot
        let inputValueWithDot = inputValue.replace(",", ".");

        // Check if the input is a valid floating-point number with a dot separator
        let regex = /^-?\d+(\.\d)?$/;
        if (regex.test(inputValueWithDot)) {
            return true;
        } else {
            alert("You must enter a weight and height rounded by max 1 digit with a dot separator.");
            console.log(inputValue)
            return false;
        }
    }
}