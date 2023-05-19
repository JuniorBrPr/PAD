import {NetworkManager} from "../framework/utils/networkManager.js";

export class emailRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    /**
     * ProfileRepository constructor.
     * Initializes route and network manager.
     */
    constructor() {
        this.#route = "/email"
        this.#networkManager = new NetworkManager();
    }

    async getEmailAndName() {
        return await this.#networkManager.doRequest(`${this.#route}/emailAndName`, "GET");
    }

    async getUserGoals() {
        return await this.#networkManager.doRequest(`${this.#route}/getUserGoals`, "GET");
    }

    async sendEmail(firstname, surname, email, subject, body) {
        return await this.#networkManager.doRequest(`https://api.hbo-ict.cloud/mail`, "POST",
            {
                fullName: firstname + surname,
                email: email,
                subject: subject,
                body: body
            });
    }
}
