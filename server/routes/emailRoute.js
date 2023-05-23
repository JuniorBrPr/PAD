const cron = require("node-cron");
const Console = require("console");
const https = require('https');


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
        const minutes = "51" // Specified on which minute
        const hours = "23" // Specified on which hour
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
                query: `SELECT usergoal.userId, usergoal.valueChosenByUser, activity.unit, activity.name
                        FROM usergoal
                                 INNER JOIN activity ON usergoal.activityId = activity.id
                                 LEFT JOIN goal ON goal.usergoalID = usergoal.id
                        WHERE usergoal.userId = ?
                          AND dayOfTheWeek = ?
                          AND (goal.usergoalID IS NULL OR goal.completed = 0)
                `,
                values: [userId, new Date().getDay()]
            });

            if (data.length > 0) {
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
            try{
            Console.log("User ID: " + userData[i].id)
            const userGoalsData = await this.#returnUserGoals(userData[i].id);
            if (userGoalsData != null) { // Check if userGoalsData is not null or empty
                // Create an empty array to store the string parts
                let stringBuilder = [];
                stringBuilder.push("Uw doelen voor vandaag zijn: ");

                for (let j = 0; j < userGoalsData.length; j++) {
                    stringBuilder.push(`${userGoalsData[j].valueChosenByUser} ${userGoalsData[j].unit} ${userGoalsData[j].name}, `)
                } // Example output: "peulvruchten eten: 50 gram"

                let result = stringBuilder.join(""); // Join the array elements into a single string
                Console.log(result)
                Console.log("sending email");
                await this.#sendEmail(userData[i].firstname, userData[i].surname, userData[i].emailAddress, subject, result);
            }
        } catch (e){
            console.log(e)
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

            const requestData = JSON.stringify(data);

            const options = {
                method: "POST",
                hostname: "api.hbo-ict.cloud",
                path: "/mail",
                headers: {
                    "Authorization": "Bearer pad_nut_2.FumYdNfXITlTORzO",
                    "Content-Type": "application/json",
                    "Content-Length": requestData.length
                }
            };

            const req = https.request(options, (res) => {
                // Check the response status and throw error if not okay
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    console.error('Failed to send email');
                }
            });

            req.on('error', (e) => {
                console.error(e);
            });

            req.write(requestData);
            req.end();
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = emailRoutes