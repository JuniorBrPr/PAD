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
        // Sends an email every day at 7 am
        cron.schedule('00 7 * * *', async () => {
            const data = await this.#emailRepository.getEmail();
            const subject = "Reminder" // Subject should be the same for every user

            for (let i = 0; i < data.data.length; i++) { // Sends email to every registered email
                const userGoals = await this.#emailRepository.getUserGoals(data.data.id);

                await this.#emailRepository.sendEmail(data.data[i].firstname, data.data[i].surname, data.data[i].emailAddress, subject, userGoals)
            }
        });
    }
}
