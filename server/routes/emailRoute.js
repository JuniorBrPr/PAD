class emailRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
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
        this.#getEmailAndName()
        this.#getUserGoals()
        this.#sendEmail()
    }


    #getEmailAndName() {
        this.#app.get("/getEmailAndName", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT emailAddress, firstname, surname, id FROM user`
                });
                //if we found at least one record we know the user exists in users table
                if (data.length >= 1) {
                    // Values individually saved
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                } else {
                    //wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Er bestaan geen geburikers"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getUserGoals() {
        this.#app.get("/getUserGoals", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT
                                usergoal.valueChosenByUser,
                                activity.unit,
                                activity.name
                            FROM usergoal
                                     INNER JOIN activity ON usergoal.activityId = activity.id
                                     INNER JOIN goal ON usergoal.id = goal.activityID
                            WHERE usergoal.userId = ?
                              AND dayOfTheWeek = ?
                              AND completed = ?

                    `,
                    values: [req.params.userId, new Date().getDay(), 0]
                });
                if (data.length >= 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #sendEmail() {
        this.#app.post("https://api.hbo-ict.cloud/mail", async (req, res) => {
            try {
                const data = {
                    "from": {
                        "name": "Fountain of Fit",
                        "address": "group@hbo-ict.cloud"
                    },
                    "to": [
                        {
                            "name": req.params.fullName,
                            "address": req.params.email
                        }
                    ],
                    "subject": req.params.subject,
                    "html": req.params.body
                }
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}
module.exports = emailRoutes