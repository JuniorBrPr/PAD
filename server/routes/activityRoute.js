/**
 * This class contains ExpressJS routes specific for the activity entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden.G
 */

class ActivityRoute {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #activityCodes = require("../framework/utils/activityCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;

    constructor(app) {
        this.#app = app;

        this.#getUserGoals();
        this.#getGoalTemplates();
        this.#createUserGoal();
    }

    /**
     * @author Jayden.G & Junior.B
     * Creates a new user goal.
     *
     * Inserts selected goals into the 'usergoal' table in the database.
     * @throws {Error} If there is an error during the database query execution.
     * @private
     */


    #createUserGoal() {
        this.#app.put("/activity/create", async (req, res) => {

            const data = req.body;

            try {
                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO usergoal(id, userId, activityId, dateMade, dayOfTheWeek, value)
                            values ?;`,
                    values: [data[0]]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    /**
     * @author Jayden.G
     * Retrieves goal templates.
     *
     * Fetches goal template data from the 'goaltemplate' and 'activity' tables in the database which
     * we end up putting into the template in selectGoal.html, this is handled in the activitycontroller.
     * @throws {Error} If there is an error during the database query execution.
     * @private
     */

    #getGoalTemplates() {
        this.#app.get("/activity/templates", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT gt.baseValue,
                                   a.name,
                                   a.description,
                                   a.unit,
                                   a.id
                            FROM goaltemplate gt
                                     INNER JOIN activity a ON gt.activityId = a.id;`,
                    values: null
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    /**
     * @author Jayden.G
     * Retrieves userGoals for userId.
     *
     * Fetches user goal data from the 'usergoal', 'goalTemplate', and 'activity' tables in the database.
     * @throws {Error} If there is an error during the database query execution.
     * @private
     */

    #getUserGoals() {
        this.#app.get("/activity/goals/:userId", async (req, res) => {
            try {
                //
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT ug.userId,
                                   a.activity_name,
                                   a.activity_description,
                                   ug.startdate,
                                   g.difficulty
                            FROM usergoal ug
                                     INNER JOIN goalTemplate g ON ug.goal_templateId = g.templateId
                                     INNER JOIN activity a ON g.activityId = a.activityId
                            WHERE ug.startDate >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                              AND ug.startDate <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
                              AND ug.userId = ?
                            GROUP BY ug.startDate ASC;`,
                    values: [this.#activityCodes.MIN_DAYS, this.#activityCodes.MAX_DAYS, req.params.userId]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ActivityRoute