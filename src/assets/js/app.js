/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

//repository imports
import {SurveyRepository} from "./repositories/surveyRepository.js";
import {UsersRepository} from "./repositories/usersRepository.js";

//framework imports
import {SessionManager} from "./framework/utils/sessionManager.js"

//controller imports
import {LoginController} from "./controllers/loginController.js"
import {NavbarController} from "./controllers/navbarController.js"
import {SurveyController} from "./controllers/surveyController.js";
import {profileController} from "./controllers/profileController.js"
import {editProfileController} from "./controllers/editProfileController.js"
import {RegisterController} from "./controllers/registerController.js";
import {WeekPlanningController} from "./controllers/weekPlanningController.js";
import {HomeController} from "./controllers/homeController.js";
import {ErrorController} from "./controllers/errorController.js";
import {RecommendationsController} from "./controllers/recommendationsController.js";
import {AdminController} from "./controllers/adminController.js";

export class App {

    //To check the survey completion
    static #surveyRepository = new SurveyRepository();
    static #usersRepository = new UsersRepository();

    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_NAVBAR = "navbar";
    static CONTROLLER_HOME = "home";
    static CONTROLLER_LOGIN = "login";
    static CONTROLLER_LOGOUT = "logout";
    static CONTROLLER_REGISTER = "register";
    static CONTROLLER_WEEKPLANNING = "weekPlanning";
    static CONTROLLER_RECOMMENDATION = "recommendation";
    static CONTROLLER_SURVEY = "survey";
    static CONTROLLER_PROFILE = "profile";
    static CONTROLLER_EDITPROFILE = "editProfile";
    static CONTROLLER_ERROR = "error";
    static CONTROLLER_ADMIN = "admin";


    constructor() {
        //Always load the navigation
        App.loadController(App.CONTROLLER_NAVBAR);

        //Attempt to load the controller from the URL, if it fails, fall back to the home controller.
        App.loadControllerFromUrl(App.CONTROLLER_HOME);
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData) {
        console.log("loadController: " + name);

        //log the data if data is being passed via controllers
        if (controllerData && Object.entries(controllerData).length !== 0) {
            console.log(controllerData);
        }

        //Check for a special controller that shouldn't modify the URL
        switch (name) {
            case App.CONTROLLER_NAVBAR:
                new NavbarController();
                return true;

            case App.CONTROLLER_LOGOUT:
                App.handleLogout();
                return true;
        }

        //Otherwise, load any of the other controllers
        App.setCurrentController(name, controllerData);

        switch (name) {

            case App.CONTROLLER_ERROR:
                new ErrorController(controllerData);
                break;

            case App.CONTROLLER_HOME:
                new HomeController();
                break;

            case App.CONTROLLER_LOGIN:
                App.isLoggedIn(
                    () => console.log("Error: Already logged in"),
                    () => new LoginController());
                break;

            case App.CONTROLLER_REGISTER:
                App.isLoggedIn(
                    () => console.log("Error: Can't register when already logged in"),
                    () => new RegisterController());
                break;

            case App.CONTROLLER_SURVEY:
                App.isLoggedIn(
                    () => new SurveyController(),
                    () => new LoginController());
                break;

            case App.CONTROLLER_PROFILE:
                App.isLoggedIn(
                    () => new profileController(),
                    () => new LoginController());
                break;

            case App.CONTROLLER_EDITPROFILE:
                App.isLoggedIn(
                    () => new editProfileController(),
                    () => new LoginController());
                break;

            case App.CONTROLLER_WEEKPLANNING:
                App.isLoggedIn(
                    () =>
                        App.hasCompletedSurvey(
                            () => new WeekPlanningController(),
                            () => new SurveyController(),
                        ),
                    () => new LoginController());
                break;

            case App.CONTROLLER_RECOMMENDATION:
                App.isLoggedIn(
                    () =>
                        App.hasCompletedSurvey(
                            () => new RecommendationsController(),
                            () => new SurveyController(),
                        ),
                    () => new LoginController());
                break;

            case App.CONTROLLER_ADMIN:
                App.isAdmin(
                    () => new AdminController(),
                    () => new ErrorController({errorCode: 403, errorMessage: "Access Forbidden"})
                )
                break;

            default:
                return false;
        }

        App.handleNavElementVisibility();
        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController.name, currentController.data)) {
                App.loadController(fallbackController);
            }
        } else {
            App.loadController(fallbackController);
        }
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        const fullPath = location.hash.slice(1);

        if (!fullPath) {
            return undefined;
        }

        const queryStringIndex = fullPath.indexOf("?");

        let path;
        let queryString;

        if (queryStringIndex >= 0) {
            path = fullPath.substring(0, queryStringIndex);
            queryString = Object.fromEntries(new URLSearchParams(fullPath.substring(queryStringIndex + 1)));
        } else {
            path = fullPath;
            queryString = undefined
        }

        return {
            name: path,
            data: queryString
        };
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     * @param controllerData
     */
    static setCurrentController(name, controllerData) {
        if (App.dontSetCurrentController) {
            return;
        }

        if (controllerData) {
            history.pushState(undefined, undefined, `#${name}?${new URLSearchParams(controllerData)}`);
        } else {
            history.pushState(undefined, undefined, `#${name}`);
        }
    }

    static handleNavElementVisibility() {
        const navElements = document.querySelectorAll(".nav-item");

        App.isLoggedIn(
            () => {

                for (const navElement of navElements) {
                    if (navElement.classList.contains("logged-out-only") || navElement.classList.contains("admin-only")) {
                        navElement.classList.add("d-none");
                    } else {
                        navElement.classList.remove("d-none");
                    }
                }

                App.isAdmin(
                    () => {
                        for (const navElement of navElements) {
                            if (navElement.classList.contains("logged-out-only")) {
                                navElement.classList.add("d-none");
                            } else {
                                navElement.classList.remove("d-none");
                            }
                        }
                    })
            },
            () => {
                for (const navElement of navElements) {
                    if (navElement.classList.contains("logged-in-only") || navElement.classList.contains("admin-only")) {
                        navElement.classList.add("d-none");
                    } else {
                        navElement.classList.remove("d-none");
                    }
                }
            }
        );
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */

    static isLoggedIn(whenYes, whenNo) {
        if (App.sessionManager.get("token")) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * @author Jayden.G
     * Convenience functions to handle role states
     *
     * @param whenYes - function to execute when user is admin
     * @param whenNo - function to execute when user is admin
     */

    static async isAdmin(whenYes, whenNo) {
        console.log("checking admin status")
        if (await this.adminStatusChecker()) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * @author Jayden.G
     * Convenience functions to handle Survey Completion states
     *
     * @param whenYes - function to execute when user has completed survey
     * @param whenNo - function to execute when user has completed survey
     */

    static async hasCompletedSurvey(whenYes, whenNo) {
        if (await this.surveyStatusChecker()) {
            whenYes();
        } else {
            whenNo();
        }
    }

    /**
     * @author Jayden.G
     * Checks for if the user has completed the surveys
     *
     * @returns {Promise<boolean>} - true if surveyStatus is complete (which would be if its 1), false otherwise
     */

    static async adminStatusChecker() {
        const status = await this.#usersRepository.isAdmin();

        return status.isAdmin;
    }

    /**
     * @author Jayden.G
     * Checks for if the user has completed the surveys
     *
     * @returns {Promise<boolean>} - true if surveyStatus is complete (which would be if its 1), false otherwise
     */

    static async surveyStatusChecker() {
        const status = await this.#surveyRepository.getSurveyStatus();

        return status.survey_status === 1;
    }

    /**
     * @author Jayden.G
     * Removes username via sessionManager and loads the login screen
     */
    static handleLogout() {
        App.sessionManager.clear();

        //handle the navbar visibility
        App.handleNavElementVisibility();

        //go to login screen
        App.loadController(App.CONTROLLER_LOGIN);

        window.location.reload();
    }
}

window.addEventListener("hashchange", function () {
    App.dontSetCurrentController = true;
    App.loadControllerFromUrl(App.CONTROLLER_HOME);
    App.dontSetCurrentController = false;
});

//When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", _ => {
    new App();
});