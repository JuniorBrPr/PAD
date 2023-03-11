class surveyRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    constructor(app) {
        this.#app = app;

        this.#getAllQuestions();
        this.#getNutritionSurvey();
        this.#getQuestionOptions();
        this.#putSurveyResult();
    }

    #getAllQuestions() {
        this.#app.get("/survey/all", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId
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
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId

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
                    query: `SELECT questionoption.id         AS id,
                                   questionoption.value      AS text,
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

    #putSurveyResult() {
        this.#app.put("/survey/response/:userId", async (req, res) => {
            console.log("putSurveyResult");
            try {
                const data = req.body;
                const userId = req.params.userId;
                console.log(data);

                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO response (id, surveyId, userId)
                            values (?, ?, ?);`,
                    values: [0, data.surveyId, userId]
                });

                for (const question of data.data) {
                    await this.#databaseHelper.handleQuery({
                        query: `INSERT INTO answer (id, responseId, questionId, answer)
                                values (0, (SELECT id FROM response WHERE userId = ? AND surveyId = ?), ?, ?);`,
                        values: [userId, data.surveyId, question.id, question.optionId]
                    });

                    for (const option of question.options) {
                        const openOption = await this.#databaseHelper.handleQuery({
                            query: `SELECT openOption as open
                                    FROM questionoption
                                    WHERE id = ?;`,
                            values: [option.optionId]
                        }).then((data) => {
                            return data[0].open;
                        });

                        await this.#databaseHelper.handleQuery({
                            query: `INSERT INTO answeroption (id, answerId, questionOtionId, text)
                                    values (0, (SELECT id
                                                FROM answer
                                                WHERE responseId =
                                                      (SELECT id
                                                       FROM response
                                                       WHERE userId = ?
                                                         AND surveyId = ?)
                                                  AND questionId = ?), ?, ?);`,
                            values: [userId, data.surveyId, question.id,
                                option.optionId, openOption ? option.text : null]
                        });
                    }
                }
                res.status(this.#errorCodes.HTTP_OK_CODE).json({message: "Survey response saved"});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = surveyRoutes;
