/**
 * Controller for creating a user in registration form
 * @author Hanan Ouardi
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

    /**
     * Sets up the view and event listeners for the registration form.
     * @private
     * @author Hanan Ouardi
     */
    async #setupView() {
        this.#registerView = await super.loadHtmlIntoContent("html_views/register.html")
        this.#registerView.querySelector(".btn").addEventListener("click", async (event) => {
            event.preventDefault();
            await this.#saveRegister();
        });
    }

    /**
     * Saves the user registration data and performs validation.
     * @private
     * @author Hanan Ouardi
     */
    async #saveRegister() {
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
                const emailExists = await this.#registerRepository.checkEmailExists(emailAddress)
                if (emailExists.code === 400) {
                    errorBox.innerHTML = "Het opgegeven e-mailadres bestaat al.";
                } else {
                    await this.#registerRepository.createRegister(firstname, surname, emailAddress, password);
                    validBox.innerHTML = "U hebt succesvol geregistreerd, u wordt zo omgeleid naar de vragenlijst";
                    App.loadController(App.CONTROLLER_SURVEY);
                }
            } catch (e) {
                errorBox.innerHTML = e.reason
            }
        }

        function validateEmail(email) {
            const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return emailFormat.test(email);
        }
    }
}
