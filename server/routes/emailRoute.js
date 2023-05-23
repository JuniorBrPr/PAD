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
        const minutes = "38" // Specified on which minute
        const hours = "00" // Specified on which hour
        // Sends an email every day at specific time
        cron.schedule(`${minutes} ${hours} * * *`, async () => {
            await this.#formatEmail()
        })
    }

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
        const subject = "Daily Reminder"; // Subject should be the same for every user
        console.log("begin format email");

        for (let i = 0; i < userData.length; i++) { // Loops for every user
            try {
                console.log("User ID: " + userData[i].id);
                const userGoalsData = await this.#returnUserGoals(userData[i].id);

                if (userGoalsData != null) { // Check if userGoalsData is not null or empty
                    let body = `<body><p>Beste ${userData[i].firstname} ${userData[i].surname},</p>
                                <p>We wilden je even laten weten dat je fantastisch bezig bent! Blijf volhouden en blijf werken aan je persoonlijke doelen.</p>
                                <p>Voor vandaag hebben we de volgende doelen voor je:</p><ul>`;

                    for (let j = 0; j < userGoalsData.length; j++) {
                        body += `<li>${userGoalsData[j].valueChosenByUser} ${userGoalsData[j].unit} ${userGoalsData[j].name}</li>`;
                    } // Example output: "<li>peulvruchten eten: 50 gram</li>"

                    body += `</ul><p>Blijf gemotiveerd en ga ervoor!</p><p>Met vriendelijke groet Fountain Of Fit</p></body>`;

                    console.log(body);
                    console.log("sending email");
                    await this.#sendEmail(userData[i].firstname, userData[i].surname, userData[i].emailAddress, subject, body);
                }
            } catch (e) {
                console.log(e);
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
                        "name": `${firstname} ${surname}`,
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
                // Check the response status and throw an error if not okay
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