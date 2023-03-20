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
            try {
                const data = req.body;
                const user = req.params.userId;

                const responseId = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO response (id, surveyId, userId)
                            values (?, ?, ?);
                    SELECT response.id
                    FROM response
                    WHERE userId = ?
                      AND surveyId = ?;`,
                    values: [0, data.surveyId, user, user, data.surveyId]
                }).then((result) => {
                    if (result[1].length === 0) {
                        throw "No response found";
                    }
                    if (result[1].length > 1) {
                        throw "More than one response found";
                    }
                    return result[1][0].id;
                })

                let answers = [];
                for (const question of data.data) {
                    answers.push([null, responseId, question.id, null]);
                }
                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO answer (id, responseId, questionId, answer)
                            VALUES ?`,
                    values: [answers]
                });

                let answersOptions = [];
                for (const question of data.data) {
                    const answerId = await this.#databaseHelper.handleQuery({
                        query: `SELECT id
                                FROM answer
                                WHERE responseId = ?
                                  AND questionId = ?;`,
                        values: [responseId, question.id]
                    }).then((result) => {
                        if (result.length === 0) {
                            throw "No answer found";
                        } else if (result.length > 1) {
                            throw "More than one answer found";
                        }
                        return result[0].id;
                    });
                    for (const option of question.options) {
                        const openOption = option.optionId != null ? await this.#databaseHelper.handleQuery({
                            query: `SELECT openOption as open
                                    FROM questionoption
                                    WHERE id = ?;`,
                            values: [option.optionId]
                        }).then((data) => {
                            return data[0].open;
                        }) : 0;

                        answersOptions.push([
                            null,
                            answerId,
                            option.optionId,
                            openOption === 1 || option.optionId === null ? option.text : null
                        ])
                    }
                }

                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO answeroption (id, answerId, questionOtionId, answeroption.text)
                            values ?;`,
                    values: [answersOptions]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({message: "Survey response saved"});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = surveyRoutes;
