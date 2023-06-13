/**
 * This class contains all the routes for the recommendations.
 * @class
 * @author Junior Javier Brito Perez
 */
class recommendationsRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper")
    #app

    constructor(app) {
        this.#app = app
        this.#getNutritionRecommendations();
        this.#getExerciseRecommendations();
        this.#postUserGoal();
    }

    /**
     * Retrieves nutrition recommendations from the database and sends them as a response to the client.
     * @private
     * @function
     * @returns {Promise<void>} A promise that resolves when the nutrition recommendations have been sent to the client.
     * @author Junior Javier Brito Perez
     */
    #getNutritionRecommendations() {
        this.#app.get("/recommendations/nutrition", this.#JWTHelper.verifyJWTToken, async (req, res) => {

            try {
                const recommendedActivities = await this.#databaseHelper.handleQuery({
                    query: `SELECT activity.id,
                                   activity.name,
                                   activity.description,
                                   activity.unit,
                                   FLOOR(nutrition_category.recommended_weekly_intake / 7) AS recommendedValue
                            FROM activity
                                     INNER JOIN nutrition_activity_attribute naa
                                                ON activity.id = naa.activityId
                                     INNER JOIN nutrition_category
                                                ON naa.category_id = nutrition_category.id
                            WHERE nutrition_category.name
                                IN (SELECT recommended_categories.categoryName
                                    FROM (SELECT nc.name                      AS categoryName,
                                                 nc.recommended_weekly_intake AS recommendedWeeklyIntake,
                                                 SUM(answer.answer)           AS weeklyUserIntake
                                          FROM answer
                                                   INNER JOIN question
                                                              ON question.id = answer.questionId
                                                   INNER JOIN response
                                                              ON response.id = answer.responseId
                                                   INNER JOIN activity
                                                              ON activity.id = question.activityId
                                                   INNER JOIN nutrition_activity_attribute naa
                                                              ON activity.id = naa.activityId
                                                   INNER JOIN nutrition_category nc
                                                              ON naa.category_id = nc.id
                                          WHERE question.activityId IS NOT NULL
                                            AND userId = ?
                                          GROUP BY categoryName
                                          HAVING weeklyUserIntake < recommendedWeeklyIntake)
                                             AS recommended_categories)
                              AND activity.id NOT IN (SELECT usergoal.activityId
                                                      FROM usergoal
                                                      WHERE usergoal.userId = ?);`,
                    values: [req.user.userId, req.user.userId]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(recommendedActivities);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Retrieves exercise recommendations from the database and sends them as a response to the client.
     * @private
     * @function
     * @returns {Promise<void>} A promise that resolves when the exercise recommendations have been retrieved from the database and sent to the client.
     * @author Junior Javier Brito Perez
     */
    #getExerciseRecommendations() {
        this.#app.get("/recommendations/exercise", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const activeMinutes = await this.#databaseHelper.handleQuery({
                    query: `SELECT answer.questionId,
                                   answer.answer,
                                   a.id as activityId
                            FROM answer
                                     INNER JOIN response r on answer.responseId = r.id
                                     INNER JOIN question q on answer.questionId = q.id
                                     LEFT JOIN activity a on q.activityId = a.id
                            WHERE r.surveyId = 2
                              AND userId = ?
                              AND answer.answer NOT LIKE 'Niet van toepassing'
                              AND answer.answer REGEXP '^minutes: ';`,
                    values: [req.user.userId]
                });

                let totalModeratelyActiveMinutes = 0;
                const HEAVY_ACTIVITY_ID = 51;

                activeMinutes.forEach((answer) => {
                    if (answer.answer.includes("Gemiddeld") || answer.answer.includes("Snel")
                        || answer.activityId === HEAVY_ACTIVITY_ID) {
                        totalModeratelyActiveMinutes += parseInt(answer.answer.split(": ")[1]);
                    }
                });

                let recommendedActivities = [];

                if (totalModeratelyActiveMinutes < 150) {
                    recommendedActivities.push(await this.#databaseHelper.handleQuery({
                        query: `SELECT activity.id,
                                       activity.name,
                                       activity.description,
                                       activity.unit,
                                       30 AS recommendedValue
                                FROM activity
                                WHERE activity.id IN (SELECT activity.id
                                                      FROM activity
                                                               INNER JOIN exercise_activity_attribute eaa
                                                                          ON activity.id = eaa.activityId
                                                      WHERE eaa.cardio = 1)
                                  AND activity.id NOT IN (SELECT usergoal.activityId
                                                          FROM usergoal
                                                          WHERE usergoal.userId = ?);`,
                        values: [req.user.userId]
                    }));
                }
                res.status(this.#errorCodes.HTTP_OK_CODE).json(recommendedActivities.flat());
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Handles the POST request to add user goals to the database.
     * @private
     * @function
     * @returns {Object} - Returns a JSON object with a success message if the request is successful.
     * @author Junior Javier Brito Perez
     */
    #postUserGoal() {
        this.#app.post("/recommendations", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const goals = req.body;
                goals.forEach((goal) => {
                    goal.push(req.user.userId);
                });
                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO usergoal (activityId, dateMade, valueChosenByUser, dayOfTheWeek, userId)
                            VALUES ?;`,
                    values: [goals]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json({message: "Recommendation added"});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = recommendationsRoutes
