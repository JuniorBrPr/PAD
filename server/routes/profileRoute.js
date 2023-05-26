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
        this.#getData()
        this.#getUserGoals()
        this.#getGoals()
        this.#insertGoal()
        this.#updateGoalCompletion()
        this.#calculateDailyGoalCompletionPercentage()
        this.#calculateWeeklyGoalCompletionPercentage()
        this.#checkIfGoalExists()
    }

    /**
     * Private method that sets up the route handler for getting user data.
     * Handles a GET request to the /profile endpoint.
     * Retrieves user data from the database and sends it as a JSON response.
     * If the user is not found, an error message is sent as a response.
     */
    #getData() {
        this.#app.get("/profile", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT firstname, surname, date_of_birth, emailAddress, weight, height
                            FROM user
                            WHERE id = ?`,
                    values: [req.user.userId]
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
        this.#app.get("/profile/userGoals", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT usergoal.userId,
                                   usergoal.dayOfTheWeek,
                                   usergoal.valueChosenByUser,
                                   activity.unit,
                                   activity.name,
                                   goal.completed,
                                   goal.value,
                                   usergoal.id AS usergoalID
                            FROM usergoal
                                     INNER JOIN activity ON usergoal.activityId = activity.id
                                     LEFT JOIN goal ON usergoal.id = goal.usergoalID
                            WHERE usergoal.userId = ?
                              AND dayOfTheWeek = ?
                              AND (goal.usergoalID IS NULL OR goal.completed = 0)
                    `,
                    values: [req.user.userId, new Date().getDay()]
                });
                if (data.length >= 1) {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getGoals() {
        this.#app.get("/profile/goals", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT usergoal.dayOfTheWeek,
                                   goal.completed,
                                   goal.value,
                                   goal.userID,
                                   goal.usergoalID
                            FROM goal
                                     INNER JOIN usergoal ON goal.usergoalID = usergoal.id
                            WHERE goal.userID = ?
                              AND usergoal.dayOfTheWeek = ?
                    `,
                    values: [req.user.userId, new Date().getDay()]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #insertGoal() {
        this.#app.post("/profile/insertGoal/:usergoalID", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO goal(usergoalID, userID, completed, value, date)
                            VALUES (?, ?, 0, ?, ?)`,
                    values: [req.params.usergoalID, req.user.userId, req.query.value, new Date()]
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
                            WHERE usergoalID = ?`,
                    values: [req.params.usergoalID]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #calculateDailyGoalCompletionPercentage() {
        this.#app.get("/profile/dailyGoalCompletionPercentage", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT (SUM(completed = 1) / COUNT(*)) * 100 AS percentage,
                                   NULL                                  AS usergoalID
                            FROM usergoal
                                     LEFT JOIN goal on usergoal.id = goal.usergoalID
                            WHERE usergoal.userId = ?
                              AND usergoal.dayOfTheWeek = ?
                            UNION
                            SELECT usergoal.id,
                                   goal.usergoalID
                            FROM usergoal
                                     RIGHT JOIN goal on usergoal.id = goal.usergoalID
                            WHERE usergoal.id IS NULL
                              AND goal.userId = ?
                              AND usergoal.dayOfTheWeek = ?;
                    `,
                    values: [req.user.userId, new Date().getDay(), req.user.userId, new Date().getDay()]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #calculateWeeklyGoalCompletionPercentage() {
        this.#app.get("/profile/weeklyGoalCompletionPercentage", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT (SUM(completed = 1) / COUNT(*)) * 100 AS percentage,
                                   NULL                                  AS usergoalID
                            FROM usergoal
                                     LEFT JOIN goal on usergoal.id = goal.usergoalID
                            WHERE usergoal.userId = ?
                            UNION
                            SELECT usergoal.id,
                                   goal.usergoalID
                            FROM usergoal
                                     RIGHT JOIN goal on usergoal.id = goal.usergoalID
                            WHERE usergoal.id IS NULL
                              AND goal.userId = ?
                    `,
                    values: [req.user.userId, req.user.userId]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #checkIfGoalExists() {
        this.#app.get("/profile/checkIfGoalExists", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT COUNT(*) AS goalCount
                            FROM goal
                            WHERE usergoalID = ?`,
                    values: [req.params.usergoalID]
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
