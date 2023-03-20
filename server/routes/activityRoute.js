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

        this.#getUserGoals();
        this.#getUserScore();
    }

    /**
     * Gets back our user goals with userId.
     * Gives us the userId, activity name, activity description, start date, end date and the difficulty
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
                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    /**
     * Returns the total score of a given user
     * @private
     */

    #getUserScore() {
        this.#app.get("/activity/score/:userId", async (req, res) => {
            try {
                let totalScore = 0;

                //Here we are requesting all goals with an end_date, Having an end date means being completed

                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT ug.userId, a.activity_name, g.difficulty
                            FROM userGoal ug
                                     INNER JOIN goalTemplate g ON ug.goal_templateId = g.templateId
                                     INNER JOIN activity a ON g.activityId = a.activityId
                            WHERE ug.endDate IS NOT NULL
                              AND ug.userId = ?
                            GROUP BY ug.userId, a.activity_name, g.difficulty;`,
                    values: [req.params.userId]
                });

                for (const item of data) {

                    /**
                     * Switch statement to add to totalScore that we give back to the user.
                     * Will be used to calculate future goals
                     */

                    switch (item.difficulty) {
                        case 1:
                            totalScore += this.#activityCodes.VERY_EASY_COEF;
                            break;
                        case 2:
                            totalScore += this.#activityCodes.EASY_COEF;
                            break;
                        case 3:
                            totalScore += this.#activityCodes.NORMAL_COEF;
                            break;
                        case 4:
                            totalScore += this.#activityCodes.HARD_COEF;
                            break;
                        case 5:
                            totalScore += this.#activityCodes.VERY_HARD_COEF;
                            break;
                    }
                }

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(totalScore);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ActivityRoute