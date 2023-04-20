/**
 * Represents the profile routes class.
 * This class is responsible for handling the profile-related routes and getting
 * user data from the database to display on the profile tab of the website.
 *
 * @author Joey_Poel
 * @class
 */

class profileRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
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
        this.#getData()
        this.#getUserGoals()
        this.#getGoals()
        this.#insertGoal()
        this.#updateGoalCompletion()
        this.#calculateDailyGoalCompletionPercentage()
    }

    /**
     * Private method that sets up the route handler for getting user data.
     * Handles a GET request to the /profile/:userId endpoint.
     * Retrieves user data from the database and sends it as a JSON response.
     * If the user is not found, an error message is sent as a response.
     */
    #getData() {
        this.#app.get("/profile/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT firstname, surname, date_of_birth, emailAddress, weight, height
                            FROM user
                            WHERE id = ?`,
                    values: [req.params.userId]
                });
                //if we founnd one record we know the user exists in users table
                if (data.length === 1) {
                    // Values individually saved
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                } else {
                    //wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Gebruiker bestaat niet"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getUserGoals() {
        this.#app.get("/profile/userGoals/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT usergoal.userId,
                                   usergoal.dayOfTheWeek,
                                   usergoal.valueChosenByUser,
                                   activity.unit,
                                   activity.name,
                                   usergoal.id AS usergoalID
                            FROM usergoal
                                     INNER JOIN activity ON usergoal.activityId = activity.id
                            WHERE usergoal.userId = ?
                              AND dayOfTheWeek = ?
                    `,
                    values: [req.params.userId, new Date().getDay()]
                });
                if (data.length >= 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                } else {
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Er zijn geen doelen gevonden"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getGoals() {
        this.#app.get("/profile/goals/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT usergoal.dayOfTheWeek,
                                   goal.completed,
                                   goal.value,
                                   goal.userID,
                                   goal.activityID AS usergoalID
                            FROM goal
                                     INNER JOIN usergoal ON goal.activityID = usergoal.id
                            WHERE goal.userID = ?
                              AND usergoal.dayOfTheWeek = ?
                    `,
                    values: [req.params.userId, new Date().getDay()]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #insertGoal() {
        this.#app.post("/profile/insertGoal/:usergoalID", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO goal(activityID, userID, completed, value, date)
                        VALUES (?, ?, 0, ?, ?)`,
                    values: [req.params.usergoalID, req.query.userId, req.query.value, new Date()]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }


    #updateGoalCompletion() {
        this.#app.put("/profile/goalCompletion/:usergoalID", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE goal
                            SET completed = 1
                            WHERE activityID = ?`,
                    values: [req.params.usergoalID]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #calculateDailyGoalCompletionPercentage() {
        this.#app.put("/profile/goalCompletionPercentage/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT (SUM(completed = 1) / COUNT(*)) * 100 AS percentage,
                                   NULL                                  AS activityID
                            FROM usergoal
                                     LEFT JOIN goal on usergoal.id = goal.activityID
                            WHERE usergoal.userId = ?
                              AND usergoal.dayOfTheWeek = ?
                            UNION
                            SELECT usergoal.id,
                                   goal.activityID
                            FROM usergoal
                                     RIGHT JOIN goal on usergoal.id = goal.activityID
                            WHERE usergoal.id IS NULL
                              AND goal.userId = ?
                              AND usergoal.dayOfTheWeek = ?;
                    `,
                    values: [req.params.userId, new Date().getDay(), req.params.userId, new Date().getDay()]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

}

/**
 * Exports the profileRoutes class.
 */
module.exports = profileRoutes
