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
        const minutes = "33" // Specified on which minute
        const hours = "13" // Specified on which hour
        // Sends an email every day at specific time
        cron.schedule(`${minutes} ${hours} * * *`, async () => {
            await this.#formatEmail()
            // await this.#sendEmail("Joey", "Van Der Poel", "Joeywognum@gmail.com","TEST", "Dit is een test")
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
            } else {
                return null
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async #returnUserGoals(userId) {
        try {
            const data = await this.#databaseHelper.handleQuery({
                query: `SELECT usergoal.userId,
                               usergoal.valueChosenByUser,
                               activity.unit,
                               activity.name
                        FROM usergoal
                                 INNER JOIN activity ON usergoal.activityId = activity.id
                        WHERE usergoal.userId = ?
                          AND dayOfTheWeek = ?
                `,
                values: [userId, new Date().getDay()]
            });

            if (data.length >= 1) {
                return data;
            } else {
                return null
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async #formatEmail() {
        const userData = await this.#returnEmailAndName();
        const subject = "Reminder"; // Subject should be the same for every user
        Console.log("begin format email")
        for (let i = 0; i < userData.length; i++) { // Loops for every user
            Console.log("User ID: " + userData[i].id)
            const userGoalsData = await this.#returnUserGoals(userData[i].id);

            if (userGoalsData.length > 0) { // Check if userGoalsData is not null or empty
                let unCompletedCounter = 0 // If uncompleted counter stays 0 no email will be sent
                // Create an empty array to store the string parts
                let stringBuilder = [];
                stringBuilder.push("Uw doelen voor vandaag zijn: \n");

                for (let i = 0; i < userGoalsData.length; i++) {
                    // When goal hasn't been made yet (goal undefined) the value will be set to 0
                    let completed = userGoalsData.data[i]?.completed || 0;

                    if (completed === 0) { // If the goal has not been completed
                        unCompletedCounter ++ // UnCompletedCounter will get higher when a goal has not been completed
                        stringBuilder.push(`${userGoalsData[i].name}: ${userGoalsData[i].valueChosenByUser} ${userGoalsData[i].unit}\n`)
                    }
                } // Example output: "peulvruchten eten: 50 gram"

                let result = stringBuilder.join(""); // Join the array elements into a single string
                Console.log("sending email");
                if (unCompletedCounter > 0){
                await this.#sendEmail(userData[i].firstname, userData[i].surname, userData[i].emailAddress, subject, result);
                }
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