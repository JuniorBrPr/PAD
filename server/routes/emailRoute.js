const cron = require("node-cron");
const Console = require("console");


class emailRoutes {
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * Constructor for the profileRoutes class.
     * Initializes the necessary dependencies and sets up the route handlers.
     *
     * @param {Object} app - The Express application instance.
     */
    constructor(app) {
        this.#app = app;
        //call method per route for the users entity
        // this.#getEmailAndName()
        // this.#getUserGoals()
        const minutes = "00" // Specified on which minute
        const hours = "7" // Specified on which hour
        // Sends an email every day at specific time
        cron.schedule(`${minutes} ${hours} * * *`, async () => {
            await this.#formatEmail()
        })
    }

    // #getEmailAndName() {
    //     this.#app.get("/getEmailAndName", async (req, res) => {
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `SELECT emailAddress, firstname, surname, id FROM user`
    //             });
    //             //if we found at least one record we know the user exists in users table
    //             if (data.length >= 1) {
    //                 // Values individually saved
    //                 res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
    //             } else {
    //                 //wrong username
    //                 res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Er bestaan geen geburikers"});
    //             }
    //         } catch (e) {
    //             res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
    //         }
    //     });
    // }
    //
    // #getUserGoals() {
    //     this.#app.get("/getUserGoals", async (req, res) => {
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `SELECT
    //                             usergoal.valueChosenByUser,
    //                             activity.unit,
    //                             activity.name
    //                         FROM usergoal
    //                                  INNER JOIN activity ON usergoal.activityId = activity.id
    //                                  INNER JOIN goal ON usergoal.id = goal.activityID
    //                         WHERE usergoal.userId = ?
    //                           AND dayOfTheWeek = ?
    //                           AND completed = ?
    //
    //                 `,
    //                 values: [req.params.userId, new Date().getDay(), 0]
    //             });
    //             if (data.length >= 1) {
    //                 res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
    //             }
    //         } catch (e) {
    //             res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
    //         }
    //     });
    // }

    async #returnEmailAndName() {
        Console.log("Haal data op uit user");
        try {
            const data = await this.#databaseHelper.handleQuery({
                query: `SELECT emailAddress, firstname, surname, id
                        FROM user`
            });

            if (data.length >= 1) {
                Console.log("return userdata");
                return data;
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async #returnUserGoals(userId) {
        try {
            const data = await this.#databaseHelper.handleQuery({
                query: `SELECT usergoal.valueChosenByUser,
                               activity.unit,
                               activity.name
                        FROM usergoal
                                 INNER JOIN activity ON usergoal.activityId = activity.id
                                 INNER JOIN goal ON usergoal.id = goal.activityID
                        WHERE usergoal.userId = ?
                          AND dayOfTheWeek = ?
                          AND completed = ?`,
                values: [userId, new Date().getDay(), 0]
            });

            if (data.length >= 1) {
                return data;
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async #formatEmail() {
        const data = await this.#returnEmailAndName();
        const subject = "Reminder"; // Subject should be the same for every user
        Console.log(("begin format email"))
        for (let i = 0; i < data.length; i++) { // Sends email to every registered email
            const userGoalsData = await this.#returnUserGoals(data[i].id);
            if (userGoalsData.length >= 1) { // If the user has at least 1 goal the email procedure will continue

                // Create an empty array to store the string parts
                let stringBuilder = [];
                stringBuilder.push("Uw doelen voor vandaag zijn: ");
                stringBuilder.push("\n"); // Empty line

                for (let i = 0; i < userGoalsData.length; i++) {
                    Console.log("Add goals to list");
                    // Append strings using push()
                    stringBuilder.push(userGoalsData[i].name);
                    stringBuilder.push(": ");
                    stringBuilder.push(userGoalsData[i].valueChosenByUser);
                    stringBuilder.push(" ");
                    stringBuilder.push(userGoalsData[i].unit);
                    stringBuilder.push("\n"); // Empty line
                } // Example output: "peulvruchten eten: 50 gram"
                let result = stringBuilder.join(""); // Join the array elements into a single string
                Console.log("sending email");
                await this.#sendEmail(data.data[i].firstname, data.data[i].surname, data.data[i].emailAddress, subject, result);
            }
        }
    }

    async #sendEmail(firstname, surname, email, subject, body) {
        try {
            const data = {
                "from": {
                    "name": "Fountain of Fit",
                    "address": "group@hbo-ict.cloud"
                },
                "to": [
                    {
                        "name": firstname + " " + surname,
                        "address": email
                    }
                ],
                "subject": subject,
                "html": body
            };

            const headers = {
                "Authorization": "Bearer pad_nut_2.FumYdNfXITlTORzO",
                "Content-Type": "application/json"
            };
            // Make the HTTP POST request with the specified headers
            const response = await fetch("https://api.hbo-ict.cloud/mail", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            });

            // Check the response status and throw error if not okay
            if (!response.ok) {
                throw new Error('Failed to send email');
            }

        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = emailRoutes