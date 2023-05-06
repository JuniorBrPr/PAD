/**
 * Implementation of a simple Session Manager
 *
 * @author Lennard Fonteijn & Pim Meijer
 */
export class SessionManager {
    //# is a private field in Javascript
    #session

    constructor() {
        try {
            this.#session = JSON.parse(localStorage.getItem("session"));
        } catch (e) {
            console.error("Failed to parse JSON object out of local storage")
        }

        //create empty object in local storage if it was empty
        if (!this.#session) {
            this.#session = {};

            this.#saveSession();
        }
    }

    /**
     * Returns the value of a key in the session object
     * @param key the key to get
     * @returns {*} the value of the key
     */

    get(key) {
        return this.#session[key];
    }

    /**
     * Returns the entire session object
     * @returns {*} the session object
     */

    getAll() {
        return this.#session;
    }

    /**
     * Sets a key in the session object and saves it
     * @param key the key to set
     * @param value the value to set
     */

    set(key, value) {
        this.#session[key] = value;

        this.#saveSession();
    }

    /**
     * Removes a key from the session object and saves it
     * @param key the key to remove
     */

    remove(key) {
        delete (this.#session[key]);

        this.#saveSession();
    }

    /**
     * Clears entire session object and saves it
     */

    clear() {
        this.#session = {};

        this.#saveSession();
    }

    /**
     * Saves the session object to local storage
     */

    #saveSession() {
        localStorage.setItem("session", JSON.stringify(this.#session));
    }

}