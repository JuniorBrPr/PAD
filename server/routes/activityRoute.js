/**
 * This class contains ExpressJS routes specific for the activity entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden Gunhan
 */

class ActivityRoute {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #activityCodes = require("../framework/utils/activityCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;

    constructor(app) {
        this.#app = app;

        this.#getUserGoalsById();
        this.#getUserScore();
    }

    /**
     * dummy data example endpoint - goals (activity screen)
     * get request, data is sent by client via url - req.params
     * @private
     */

    #getUserGoalsById() {
        this.#app.get("/activity/:userId/goals", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT a.activity_name, gt.difficulty " +
                        "FROM activity a " +
                        "JOIN goalTemplate gt " +
                        "ON a.activityId = gt.activityId"
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getUserScore() {
        this.#app.get("/activity/:userId/score", async (req, res) => {
            try {

                //Here we are requesting all goals with an end_date, Having an end date means being completed
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT ug.userId, a.activity_name, g.difficulty" +
                        "FROM userGoal ug" +
                        "INNER JOIN goalTemplate g ON ug.goal_templateId = g.templateId" +
                        "INNER JOIN activity a ON g.activityId = a.activityId" +
                        "WHERE ug.endDate IS NOT NULL AND ug.userId = ?" +
                        "GROUP BY ug.userId, a.activity_name, g.difficulty;",
                    values: [req.params.userId]
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ActivityRoute