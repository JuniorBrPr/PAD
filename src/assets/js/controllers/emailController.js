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
        const data = await this.#emailRepository.getEmailAndName();
        const subject = "Reminder"; // Subject should be the same for every user

        for (let i = 0; i < data.data.length; i++) { // Sends email to every registered email
            const userGoalsData = await this.#emailRepository.getUserGoals(data.data[i].id);
            if (userGoalsData.data.length >= 1) { // If the user has at least 1 goal the email procedure will continue

                // Create an empty array to store the string parts
                let stringBuilder = [];
                stringBuilder.push("Uw doelen voor vandaag zijn: ");
                stringBuilder.push("\n"); // Empty line

                for (let j = 0; j < userGoalsData.data.length; j++) {
                    // Append strings using push()
                    stringBuilder.push(userGoalsData.data[j].name);
                    stringBuilder.push(": ");
                    stringBuilder.push(userGoalsData.data[j].valueChosenByUser);
                    stringBuilder.push(" ");
                    stringBuilder.push(userGoalsData.data[j].unit);
                    stringBuilder.push("\n"); // Empty line
                } // Example output: "peulvruchten eten: 50 gram"
                let result = stringBuilder.join(""); // Join the array elements into a single string

                await this.#emailRepository.sendEmail(data.data[i].firstname, data.data[i].surname, data.data[i].emailAddress, subject, result);
            }
        }
    }

}
