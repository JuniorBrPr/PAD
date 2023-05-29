/**
 * Controller for create registration
 */

import {Controller} from "./controller.js";
import {RegisterRepository} from "../repositories/registerRepository.js";
import {App} from "../app.js";

export class RegisterController extends Controller {
    #registerView
    #registerRepository;

    constructor() {
        super();

        this.#registerRepository = new RegisterRepository();
        this.#setupView()
    }

    async #setupView() {
        this.#registerView = await super.loadHtmlIntoContent("html_views/register.html")

        this.#registerView.querySelector(".btn").addEventListener("click",
            (event) => this.#saveRegister(event));

    }
    async #saveRegister(event) {
        event.preventDefault();

        const errorBox = this.#registerView.querySelector(".error")
        const validBox = this.#registerView.querySelector(".valid-feedback");
        const invalidBox = this.#registerView.querySelector(".invalid-feedback");

        let firstname = this.#registerView.querySelector("#inputFirstName").value.trim();
        let surname = this.#registerView.querySelector("#inputLastName").value.trim();
        let emailAddress = this.#registerView.querySelector("#inputEmail").value.trim();
        let password = this.#registerView.querySelector("#inputPassword").value.trim();
        let confirmPassword = this.#registerView.querySelector("#inputConfirmPassword").value.trim();

        errorBox.innerHTML = "";
        invalidBox.innerHTML = "";

        if (!firstname || !surname || !emailAddress || !password || !confirmPassword) {
            errorBox.innerHTML = "U moet eerst uw gegevens invullen";
        } else if (!validateEmail(emailAddress)) {
            errorBox.innerHTML = "Email klopt niet";
        } else if (password !== confirmPassword) {
            errorBox.innerHTML = "wachtwoorden komen niet overeen!";
        } else {
            try {
                const data = await this.#registerRepository.createRegister(firstname, surname, emailAddress, password);
                console.log(data);
                validBox.innerHTML = "U hebt succesvol geregistreerd, u wordt zo omgeleid naar de vragenlijst";
                console.log(firstname + surname + emailAddress + password + confirmPassword);
                App.loadController(App.CONTROLLER_SURVEY);
            } catch (e) {
                errorBox.innerHTML = "Er is iets fout gegaan!"
                console.log(e)
            }
        }
        function validateEmail(email) {
            const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailFormat.test(email);
        }
    }
}
