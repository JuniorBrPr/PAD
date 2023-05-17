import { Controller } from "./controller.js";
import { emailRepository } from "../repositories/emailRepository.js";
import cron from 'node-cron';

export class emailController extends Controller {
    #emailRepository

    /**
     * Constructs a new emailController instance.
     */
    constructor() {
        super();
        this.#emailRepository = new emailRepository();
        const minutes = "00" // Specified on which minute
        const hours = "7" // Specified on which hour
        // Sends an email every day at specific time
        cron.schedule(`${minutes} ${hours} * * *`, async () => {
            await this.#sendEmail()
        })

    }

    async #sendEmail() {
        const data = await this.#emailRepository.getEmail();
        const subject = "Reminder"; // Subject should be the same for every user

        for (let i = 0; i < data.data.length; i++) { // Sends email to every registered email
            const userGoalsData = await this.#emailRepository.getUserGoals(data.data[i].id);

            // Create an empty array to store the string parts
            let stringBuilder = [];

            for (let j = 0; j < userGoalsData.data.length; j++) {
                // Append strings using push()
                stringBuilder.push("\n"); // Empty line
                stringBuilder.push(userGoalsData.data[j].name);
                stringBuilder.push(": ");
                stringBuilder.push(userGoalsData.data[j].valueChosenByUser);
                stringBuilder.push(" ");
                stringBuilder.push(userGoalsData.data[j].unit);
                stringBuilder.push("\n"); // Empty line
            }

            // Join the array elements into a single string
            let result = stringBuilder.join("");

            console.log(result); // Example output: "peulvruchten eten: 50 gram"

            await this.#emailRepository.sendEmail(data.data[i].firstname, data.data[i].surname, data.data[i].emailAddress, subject, result);
        }
    }

}
