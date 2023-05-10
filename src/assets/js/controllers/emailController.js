import { Controller } from "./controller.js";
import { emailRepository } from "../repositories/emailRepository.js";
import cron from 'node-cron';
import nodemailer from 'nodemailer';

// create reusable transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'FountainOfFit.official@gmail.com',
        pass: 'F0unt41n#1'
    }
});

// email sending function
function sendEmail(emailRecipient, subject, userGoals) {
    let mailOptions = {
        from: 'FountainOfFit.official@gmail.com',
        to: emailRecipient,
        subject: subject,
        text: userGoals.data // NEED TO FORMAT THIS
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

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
                let userId = data.data.id
                const userGoals = await this.#emailRepository.getUserGoals(userId);
                sendEmail(data.data[i].emailAddress, subject, userGoals);
            }
        });
    }
}
