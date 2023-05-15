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

            const userId = req.user.id;

            try {
                const answers = await this.#databaseHelper.handleQuery({
                    query: `SELECT answer.questionId            AS questionId,
                                   answer.answer                AS answer,
                                   question.activityId          AS activityId,
                                   activity.name                AS activityName,
                                   activity.recommendedPortions AS recommendedPortions
                            FROM answer
                                     INNER JOIN question on question.id = answer.questionId
                                     INNER JOIN response ON response.id = answer.responseId
                                     INNER JOIN activity ON activity.id = question.activityId
                            WHERE activityId IS NOT NULL
                              AND userId = ?;`
                    ,
                    values: [userId]
                });

                let recommendations = [];
                for (let i = 0; i < answers.length; i++) {
                    if (parseInt(answers[i].answer) < parseInt(answers[i].recommendedPortions)) {
                        recommendations.push(answers[i].activityId);
                    }
                }

                const r = await this.#databaseHelper.handleQuery({
                    query: `SELECT DISTINCT *
                            FROM activity
                            WHERE id IN (?);`
                    ,
                    values: [recommendations]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(r);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = recommendationsRoute
