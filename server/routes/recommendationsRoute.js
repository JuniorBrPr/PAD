class recommendationsRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper")
    #app

    constructor(app) {
        this.#app = app
        this.#getNutritionRecommendations();
    }

    #getNutritionRecommendations() {
        this.#app.get("/recommendations/nutrition", this.#JWTHelper.verifyJWTToken, async (req, res) => {

            try {
                const recommendedActivities = await this.#databaseHelper.handleQuery({
                    query: `SELECT activity.id,
                                   activity.name,
                                   activity.description,
                                   activity.unit,
                                   nutrition_category.recommended_weekly_intake AS recommendedValue
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
                                                   AS recommended_categories);`,
                    values: [req.user.userId]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(recommendedActivities);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getExerciseRecommendations() {

    }
}

module.exports = recommendationsRoute
