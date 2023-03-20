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


    async #saveRegister(event) { //async later toevoegen || event tussen () zetten
        event.preventDefault();

        const firstName = this.#registerView.querySelector("#inputFirstName").value;
        const lastName = this.#registerView.querySelector("#inputLastName").value;
        const email = this.#registerView.querySelector("#inputEmail").value;
        const password = this.#registerView.querySelector("#inputPassword").value;
        const confirmPassword = this.#registerView.querySelector("#inputConfirmPassword").value;

        const errorBox = this.#registerView.querySelector(".error")

        if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            errorBox.innerHTML = "U moet eerst uw gegevens invullen";

            return;
        } else {

            errorBox.innerHTML = "";
            console.log(firstName + lastName + email + password + confirmPassword);
            try {
                errorBox.innerHTML = "";
                const data = await this.#registerRepository.createRegister(firstName, lastName, email, password, confirmPassword);
                console.log(data);

                if (data.id) {
                    App.loadController(App.CONTROLLER_WELCOME);
                }
            } catch (e) {
                errorBox.innerHTML = "Er is iets fout gegaan!"
                console.log(e)
            }
        }





    }
}
