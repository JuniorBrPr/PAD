import {NetworkManager} from "../framework/utils/networkManager.js";


export class profileRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/profile"
        this.#networkManager = new NetworkManager();
        this.getData(1)
    }

    #firstname
    #surname
    #date_of_birth
    #emailAdress
    #weight
    #height

    async getAll() {

    }

    async getData(userId) {
        // return await this.#networkManager.doRequest(`${this.#route}/${userId}/profile`, "GET", userId);
        const userData = await this.#networkManager.doRequest(`${this.#route}/${userId}/profile`, "GET", userId);
        this.#firstname = userData.firstname;
        this.#surname = userData.surname;
        this.#date_of_birth = userData.date_of_birth;
        this.#emailAdress = userData.emailAdress;
        this.#weight = userData.weight;
        this.#height = userData.height;
    }

    async create() {

    }

    async delete() {

    }

    async update(id, values = {}) {

    }

    get firstname() {
        return this.#firstname;
    }

    get surname() {
        return this.#surname;
    }

    get date_of_birth() {
        return this.#date_of_birth;
    }

    get emailAdress() {
        return this.#emailAdress;
    }

    get weight() {
        return this.#weight;
    }

    get height() {
        return this.#height;
    }


}