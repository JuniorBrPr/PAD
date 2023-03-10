class surveyRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        this.#getAllQuestions();
        this.#getNutritionSurvey();
        this.#getQuestionOptions();
    }

    #getAllQuestions() {
        this.#app.get("/survey/all", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionType.type     AS type
                            FROM question
                                     INNER JOIN questionType ON question.questionTypeId = questionType.id
                            ORDER BY question.order;`,
                    values: []
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getNutritionSurvey() {
        this.#app.get("/survey/nutrition", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionType.type     AS type
                            FROM question
                                     INNER JOIN questionType ON question.questionTypeId = questionType.id
                            WHERE question.surveyId = 1
                            ORDER BY question.order;`,
                    values: []
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #getQuestionOptions() {
        this.#app.get("/survey/options/:questionId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT questionoption.value      AS text,
                                   questionoption.openOption AS open
                            FROM questionoption
                            WHERE questionId = ?
                            ORDER BY questionoption.order;`,
                    values: [req.params.questionId]
                });

                if (data.length === 0) {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "No options found for this question"});
                } else {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = surveyRoutes