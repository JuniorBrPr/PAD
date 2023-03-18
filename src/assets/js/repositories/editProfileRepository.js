import {NetworkManager} from "../framework/utils/networkManager.js";


export class editProfileRepository {
    //# is a private field in Javascript
    #route
    #networkManager

    constructor() {
        this.#route = "/editProfile"
        this.#networkManager = new NetworkManager();
    }

    async sendData(fistname, surname, email, weight, height, age, userId) {
        return await this.#networkManager.doRequest(`${this.#route}/${userId}`, "PUT",
            {
                firstname: fistname,
                surname: surname,
                email: email,
                weight: weight,
                height: height,
                age: age,
                userId: userId
            });
    }
}