/**
 * EditProfileController class for handling user profile editing.
 * @author Joey_Poel
 */
import {Controller} from "./controller.js";
import {editProfileRepository} from "../repositories/editProfileRepository.js";
import {App} from "../app.js";


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
        document.getElementById("backToProfile").addEventListener("click", (event) => App.loadController(App.CONTROLLER_PROFILE));

        // Load all existing data of the user as standard values
        let data = await this.#editProfileRepository.getData(0);
        document.getElementById("InputFirstname").value = data.data[0].firstname
        document.getElementById("InputSurname").value = data.data[0].surname
        document.getElementById("InputEmail").value = data.data[0].emailAddress
        document.getElementById("InputAge").value = new Date(data.data[0].date_of_birth).toISOString().split('T')[0]
        document.getElementById("InputHeight").value = data.data[0].height
        document.getElementById("InputWeight").value = data.data[0].weight
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
        try {
            const checkFirstname = await this.#checkFirstName(firstname);

            const calculateMinBirthDayResult = await this.#calculateMinBirthDay(age);

            const checkWeightValueResult = await this.#checkWeightValue(weight);

            const checkHeightValueResult = await this.#checkHeightValue(height);

            const checkEmailValueResult = await this.#checkEmailValue(email);

            if (
                checkFirstname === true &&
                calculateMinBirthDayResult === true &&
                checkWeightValueResult === true &&
                checkHeightValueResult === true &&
                checkEmailValueResult === true
            ) {
                await this.#sendData(firstname, surname, email, height, weight, age, 1);
                App.loadController(App.CONTROLLER_PROFILE);
            } else {
                console.log("Input values are not all correct");
            }
        } catch (error) {
            console.error("An error occurred: ", error);
        }
    }

    /**
     * Checks if the input date is within an acceptable age range.
     * @private
     * @param {} inputDate - The input date as a string.
     * @returns {Promise<boolean>} - A that resolves to true if the age is valid, false otherwise.
     */
    async #calculateMinBirthDay(inputDate) {
        let minAge = 18
        let maxAge = 100
        let InputAge = document.getElementById('InputAge')
        let invalidAge = document.getElementById('invalidAge')
        invalidAge.innerHTML = `Leeftijd moet tussen ${minAge} en ${maxAge} liggen`
        let today = new Date();
        let dob = new Date(inputDate)
        let ageDiff = today.getTime() - dob.getTime();
        let ageDate = new Date(ageDiff);
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < minAge || age > maxAge) {
            InputAge.style.borderColor = 'red'
            invalidAge.style.display = 'block'
            return false;
        } else {
            InputAge.style.borderColor = '#ccc'
            invalidAge.style.display = 'none'
            return true;
        }
    }

    /**
     * Checks if the input weight is within an acceptable range.
     * @private
     * @param {number} weight - The input weight value.
     * @returns {Promise<boolean>} - that resolves to true if the weight is valid, false otherwise.
     */
    async #checkWeightValue(weight) {
        let minWeight = 50
        let maxWeight = 200
        let InputWeight = document.getElementById('InputWeight')
        let invalidWeight = document.getElementById('invalidWeight')
        invalidWeight.innerHTML = `Gewicht moet tussen ${minWeight} en ${maxWeight} kilo liggen`

        if (weight <= maxWeight && weight >= minWeight) {
            InputWeight.style.borderColor = '#ccc'
            invalidWeight.style.display = 'none'
            return true;
        } else {
            InputWeight.style.borderColor = 'red'
            invalidWeight.style.display = 'block'
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
        let minHeight = 100
        let maxHeight = 250
        let InputHeight = document.getElementById('InputHeight')
        let invalidHeight = document.getElementById('invalidHeight')
        invalidHeight.innerHTML = `Lengte moet tussen ${minHeight} en ${maxHeight} cm liggen`;

        if (height <= maxHeight && height >= minHeight) {
            InputHeight.style.borderColor = '#ccc'
            invalidHeight.style.display = 'none'
            return true;
        } else {
            InputHeight.style.borderColor = 'red'
            invalidHeight.style.display = 'block'
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
        let InputEmail = document.getElementById('InputEmail')
        let invalidEmail = document.getElementById('invalidEmail')
        invalidEmail.innerHTML = `Email adres is ongeldig`

        if (emailRegex.test(email)) {
            InputEmail.style.borderColor = '#ccc'
            invalidEmail.style.display = 'none'
            return true;
        } else {
            InputEmail.style.borderColor = 'red'
            invalidEmail.style.display = 'block'
            return false;
        }
    }

    async #checkFirstName(firstname) {
        let inputFirstName = document.getElementById('InputFirstname')
        let invalidFirstname = document.getElementById('invalidFirstname')
        invalidFirstname.innerHTML = `Voornaam is verplicht`
        if (firstname.trim().length === 0) {
            inputFirstName.style.borderColor = 'red'
            invalidFirstname.style.display = 'block'
            return false;
        } else {
            inputFirstName.style.borderColor = '#ccc'
            invalidFirstname.style.display = 'none'
            return true;
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
        let parsedValue = parseFloat(inputValueWithDot);
        return parsedValue.toFixed(1); // Limit to one decimal place
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
     */
    async #sendData(firstname, surname, email, height, weight, age) {
        try {
            await this.#editProfileRepository.sendData(firstname, surname, email, weight, height, age)
        } catch (e) {
            console.log("Er is iets fout gegaan", e)
        }
    }
}
