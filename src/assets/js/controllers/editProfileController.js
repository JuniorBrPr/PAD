/**
 * EditProfileController class for handling user profile editing.
 * @author Joey_Poel
 */
import {Controller} from "./controller.js";
import {editProfileRepository} from "../repositories/editProfileRepository.js";


export class editProfileController extends Controller {
    #createProfileEditView
    #editProfileRepository
    #data

    /**
     * Constructs an instance of the EditProfileController.
     */
    constructor() {
        super();
        this.#editProfileRepository = new editProfileRepository()
        this.#setupView();
    }

    /**
     * Constructs an instance of the EditProfileController.
     */
    async #setupView() {
        this.#createProfileEditView = await super.loadHtmlIntoContent("html_views/editProfile.html")
        document.getElementById("saveProfileBtn").addEventListener("click", (event) => this.#validateForm());
        document.getElementById("InputProfileImage").addEventListener("change", () => this.#setProfileImage())
    }

    /**
     * Validates the form input and saves the profile if all values are correct.
     * @private
     */
    async #validateForm() {
        let firstname = document.getElementById("InputFirstname").value
        let surname = document.getElementById("InputSurname").value
        let email = document.getElementById("InputEmail").value
        let height = this.#correctWeightOrHeight(document.getElementById("InputHeight").value)
        let weight = this.#correctWeightOrHeight(document.getElementById("InputWeight").value)
        let age = document.getElementById("InputAge").value
        if (
            await this.#checkWeightOrHeightSyntax(height) &&
            await this.#checkWeightOrHeightSyntax(weight) &&
            await this.#calculateMinBirthDay(age) &&
            await this.#checkWeightValue(weight) &&
            await this.#checkHeightValue(height) &&
            await this.#checkEmailValue(email)
        ) {
            if (confirm("Weet je zeker dat je je wijzigingen wilt opslaan?")) {
                await this.#saveProfileImage()
                await this.#sendData(firstname, surname, email, height, weight, age, 1)
                location.reload();
            }
        } else {
            console.log("Input values are not all correct")
        }
    }

    /**
     * Checks if the input date is within an acceptable age range.
     * @private
     * @param {} inputDate - The input date as a string.
     * @returns {Promise<boolean>} - A that resolves to true if the age is valid, false otherwise.
     */
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

    /**
     * Checks if the input value is floating-point number with a dot separator.
     * @private
     * @param {string} inputValue - The input value as a string.
     * @returns {Promise<boolean>} - A promise that resolves to true if the input is valid, false otherwise.
     */
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

    /**
     * Checks if the input weight is within an acceptable range.
     * @private
     * @param {number} weight - The input weight value.
     * @returns {Promise<boolean>} - that resolves to true if the weight is valid, false otherwise.
     */
    async #checkWeightValue(weight) {
        if (weight < 635 && weight > 25) {
            return true;
        } else {
            alert("Gewicht moet tussen 25 en 635 kilo zijn");
            return false;
        }
    }

    /**
     * Checks if the input height is within an acceptable range.
     * @private
     * @param {number} height - The input height value.
     * @returns {Promise<boolean>} - A promise that resolves to true if the height is valid, false otherwise.
     */
    async #checkHeightValue(height) {
        if (height < 246 && height > 54) {
            return true;
        } else {
            alert("Lengte moet tussen 54 en 246 cm zijn");
            return false;
        }
    }

    /**
     * Checks if the input email is valid.
     * @private
     * @param {string} email - The input email value.
     * @returns {Promise<boolean>} - A promise that resolves to true if the email is valid, false otherwise.
     */
    async #checkEmailValue(email) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (emailRegex.test(email)) {
            return true;
        } else {
            alert("Email is incorrect, juiste manier: Voorbeeld@domein.com");
            return false;
        }
    }
    /**
     * Checks if the input email is valid.
     * @private
     * @param {string} email - The input email value.
     * @returns {Promise<boolean>} - A promise that resolves to true if the email is valid, false otherwise.
     */
    #correctWeightOrHeight(inputValue) {
        let inputValueWithDot = inputValue.replace(',', '.');
        return inputValueWithDot
    }
    /**
     * Sets the profile image based on the input.
     * @private
     */
    async #setProfileImage() {
        let profileImage = document.getElementById("InputProfileImage")
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            document.getElementById("imagePreview").setAttribute("src", reader.result);
        })
        reader.readAsDataURL(profileImage.files[0]);
    }
    /**
     * Sets the profile image based on the input.
     * @private
     */
    async #saveProfileImage() {
        let profileImage = document.getElementById("InputProfileImage")
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            localStorage.setItem("profile-image", reader.result);
            console.log(localStorage.getItem("profile-image"))
            document.getElementById("imagePreview").setAttribute("src", localStorage.getItem("profile-image"));
        })
        reader.readAsDataURL(profileImage.files[0]);
    }
    /**
     * Sends the updated profile data to the repository.
     * @private
     * @param {string} firstname - The user's first name.
     * @param {string} surname - The user's surname.
     * @param {string} email - The user's email.
     * @param {number} height - The user's height.
     * @param {number} weight - The user's weight.
     * @param {string} age - The user's age.
     * @param { userId - The user's ID.
     */
    async #sendData(firstname, surname, email, height, weight, age, userId) {
        try {
            const data = await this.#editProfileRepository.sendData(firstname, surname, email, weight, height, age, userId)
        } catch (e) {
            console.log("Er is iets fout gegaan", e)
        }
    }
}
