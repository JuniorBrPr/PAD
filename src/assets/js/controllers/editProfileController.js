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
        document.getElementById("InputProfileImage").addEventListener("change", () => this.#getProfileImage())
    }

    async #validateForm() {
        let firstname = document.getElementById("InputFirstname").value
        let surname = document.getElementById("InputSurname").value
        let email = document.getElementById("InputEmail").value
        let height = this.#correctWeightOrHeight(document.getElementById("InputHeight").value)
        let weight = this.#correctWeightOrHeight(document.getElementById("InputWeight").value)
        let age = document.getElementById("InputAge").value
        // const profileImageURL = await this.#getProfileImage()
        if (
            await this.#checkWeightOrHeightSyntax(height) &&
            await this.#checkWeightOrHeightSyntax(weight) &&
            await this.#calculateMinBirthDay(age) &&
            await this.#checkWeightValue(weight) &&
            await this.#checkHeightValue(height)
        ) {
            if (confirm("Weet je zeker dat je je wijzigingen wilt opslaan?")) {
                await this.#sendData(firstname, surname, email, height, weight, age, 1)
                // location.reload();
            }
        } else {
            console.log("Input values are not all correct")
        }
    }

    async #calculateMinBirthDay(inputDate) {
        let today = new Date();
        let dob = new Date(inputDate)
        let ageDiff = today.getTime() - dob.getTime();
        let ageDate = new Date(ageDiff);
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 18 || age > 100) {
            alert("Om deze website te gebruiken moet uw leeftijd moet tussen 18 en 100 liggen.");
            return false;
        }
        return true;
    }

    async #checkWeightOrHeightSyntax(inputValue) {
        // Check if the input is a valid floating-point number with a dot separator
        let regex = /^-?\d+(\.\d)?$/;
        if (regex.test(inputValue)) {
            return true;
        } else {
            alert("Gewicht en lengte moeten op 1 decimaal afgerond worden");
            return false;
        }
    }

    async #checkWeightValue(weight){
        if(weight < 635 && weight > 25){
            return true;
        } else {
            alert("Gewicht moet tussen 25 en 635 kilo zijn");
            return false;
        }
    }

    async #checkHeightValue(height){
        if(height < 246 && height > 54){
            return true;
        } else {
            alert("Lengte moet tussen 25 en 246 cm zijn");
            return false;
        }
    }

    #correctWeightOrHeight(inputValue){
        let inputValueWithDot = inputValue.replace(',', '.');
        return inputValueWithDot
    }

    async #getProfileImage() {
        let profileImage = document.getElementById("InputProfileImage")
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            localStorage.setItem("recent-image", reader.result);
            const recentImageDataUrl = localStorage.getItem("recent-image")
            console.log(recentImageDataUrl)
            document.getElementById("imagePreview").setAttribute("src", recentImageDataUrl);
        })
        reader.readAsDataURL(profileImage.files[0])
        const binaryData = atob((localStorage.getItem("recent-image")).split(',')[1]);
        const file = new File([binaryData], "image.png", {type: "image/png"});
        console.log(file)
        return file;
    }

    async #sendData(firstname, surname, email, height, weight, age, userId) {
        try {
            const data = await this.#editProfileRepository.sendData(firstname, surname, email, weight, height, age, userId)
        } catch (e) {
            console.log("Er is iets fout gegaan", e)
        }
    }
}
