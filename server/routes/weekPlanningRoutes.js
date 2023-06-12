/**
 * Route for week planning
 * @author Hanan Ouardi
 */

class WeekPlanningRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #app

    /**
     * Constructs a WeekPlanningRoutes object.
     * Initializes the app and sets up the routes.
     *
     * @param {object} app - The Express app object.
     */
    constructor(app) { //initialize the object
        this.#app = app;

        this.#userWeekPlanning();
        this.#userActivities();
    }

    /**
     * Handles the GET request to retrieve user activities.
     * Verifies the JWT token and fetches the activities from the database.
     *
     * @private
     * @author Hanan Ouardi
     */
    #userActivities() {
        this.#app.get("/planning", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT usergoal.userId,
                                   usergoal.valueChosenByUser,
                                   usergoal.dayOfTheWeek,
                                   usergoal.id,
                                   activity.unit,
                                   usergoal.activityId,
                                   activity.name
                            FROM usergoal
                                     INNER JOIN activity ON activity.id = usergoal.activityId
                            WHERE usergoal.userId = ?;
                    `,
                    values: [req.user.userId]
                });
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data received from the repository");
                }
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Handles the  POST request to update user week planning.
     * Verifies the JWT token and inserts the data into the database.
     *
     * @private
     * @author Hanan Ouardi
     */
    #userWeekPlanning() {
        this.#app.post("/planning", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO goal(userID, completed, date, usergoalID) VALUES (?, ?, ?, ?)",
                    values: [req.user.userId, 1, req.body.date, req.body.usergoalID],
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

}

module.exports = WeekPlanningRoutes;