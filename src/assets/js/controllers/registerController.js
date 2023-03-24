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

        let firstname = this.#registerView.querySelector("#inputFirstName").value;
        let surname = this.#registerView.querySelector("#inputLastName").value;
        let emailAdress = this.#registerView.querySelector("#inputEmail").value;
        let password = this.#registerView.querySelector("#inputPassword").value;
        let confirmPassword = this.#registerView.querySelector("#inputConfirmPassword").value;

        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        const errorBox = this.#registerView.querySelector(".error")

        if (firstname.length === 0 || surname.length === 0 || emailAdress.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            errorBox.innerHTML = "U moet eerst uw gegevens invullen";
        } else if (mailFormat.test(emailAdress) == false ) {
            errorBox.innerHTML = "Email klopt niet"
        } else if (password !== confirmPassword) {
           errorBox.innerHTML = "wachtwoorden matchen niet!";
        }
        else {
           window.alert("U hebt succesvol geregistreerd, u wordt zo omgeleid naar de vragenlijst");
        }


        // else {
        //     errorBox.innerHTML = "";
        //     console.log(firstname + surname + emailAdress + password + confirmPassword);
        //
        //     try {
        //         errorBox.innerHTML = "";
        //         const data = await this.#registerRepository.createRegister(firstname, surname, emailAdress, password);
        //         console.log(data);
        //
        //         if (data.id) {
        //             App.loadController(App.CONTROLLER_WELCOME);
        //         }
        //     } catch (e) {
        //         errorBox.innerHTML = "Er is iets fout gegaan!"
        //         console.log(e)
        //     }
        // }


    }




}
