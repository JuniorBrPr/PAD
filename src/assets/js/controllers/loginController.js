/**
 * Controller responsible for all events in login view
 * @author Pim Meijer
 */

import { UsersRepository } from "../repositories/usersRepository.js";
import { App } from "../app.js";
import { Controller } from "./controller.js";

export class LoginController extends Controller{
    //# is a private field in Javascript
    #usersRepository
    #loginView

    constructor() {
        super();
        this.#usersRepository = new UsersRepository();

        this.#setupView()
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<void>}
     */
    async #setupView() {
        //await for when HTML is loaded, never skip this method call in a controller
        this.#loginView = await super.loadHtmlIntoContent("html_views/login.html")

        //from here we can safely get elements from the view via the right getter
        this.#loginView.querySelector(".btn").addEventListener("click", event => this.#handleLogin(event));

    }

    /**
     * @author Jayden.G & Framework Creators
     * Handles login event and when successful, loads the profile page and sets session data.
     *
     * @param event prevents default.
     * @private
     */

    async #handleLogin(event) {
        //prevent actual submit and page refresh
        event.preventDefault();
        //handle the navbar visibility
        App.handleNavElementVisibility();

        //get the input field elements from the view and retrieve the value
        const emailAddress = this.#loginView.querySelector("#InputEmailAddress").value;
        const password = this.#loginView.querySelector("#InputPassword").value;

        try{
            const user = await this.#usersRepository.login(emailAddress, password);

            //let the session manager know we are logged in by setting the username, never set the password in localstorage
            App.sessionManager.set("token", user.accessToken);

            console.log(user.toString());
            console.log(App.sessionManager.get("token"));

            App.loadController(App.CONTROLLER_HOME);

            window.location.reload();
        } catch(error) {
            //if unauthorized error code, show error message to the user
            if(error.code === 401) {
                this.#loginView.querySelector(".error").innerHTML = error.reason
            } else {
                console.error(error);
            }
        }
    }
}