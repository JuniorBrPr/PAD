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
        this.#getEmail()
        this.#getUserGoals()
    }


    #getEmail() {
        this.#app.get("/profile", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT emailAddress, id FROM user`
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
        this.#app.get("/email/userGoals", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT
                                usergoal.valueChosenByUser,
                                activity.unit,
                                activity.name
                            FROM usergoal
                                     INNER JOIN activity ON usergoal.activityId = activity.id
                            WHERE usergoal.userId = ?
                              AND dayOfTheWeek = ?
                    `,
                    values: [req.params.userId, new Date().getDay()]
                });
                if (data.length >= 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}