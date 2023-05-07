/**
 *This file contains the routes for the survey. The routes are used to get all questions, get all questions for the
 *nutrition survey, get the options for a question and put the survey result.
 *
 *@author Junior Javier Brito Perez
 */
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
        this.#getUnansweredSurveys();
        this.#setSurveyComplete();
        this.#setSurveyIncomplete();
        this.#getSurveyStatus()
    }

    /**
     * Get the ID's of all surveys that have not been answered by the user.
     * @private
     * @returns {Promise<>} - The ID's of the surveys that have not been answered by the user.
     * @author Junior Javier Brito Perez
     */
    #getUnansweredSurveys() {
        this.#app.get("/survey/answered/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT survey.id AS id
                            FROM survey
                                     INNER JOIN question on survey.id = question.surveyId
                            WHERE question.id NOT IN (SELECT questionId
                                                      FROM answer
                                                               JOIN response on response.id = answer.responseId
                                                      WHERE response.userId = ?)
                            GROUP BY survey.id;`,
                    values: [req.params.userId]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Gets all questions from the database. The questions are ordered by the order column.
     * @private
     * @returns {Promise<>} - All questions from the database.
     * @author Junior Javier Brito Perez
     * */
    #getAllQuestions() {
        this.#app.get("/survey/all", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query:
                        `SELECT question.id           AS id,
                                question.questionText AS text,
                                questionType.type     AS type,
                                question.surveyId     AS surveyId
                         FROM question
                                  INNER JOIN questionType ON question.questionTypeId = questionType.id
                         ORDER BY question.order;`,
                    values: []
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch
                (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
        ;
    }

    /**
     * Gets all questions from the nutrition survey that the use has not answered. The questions are ordered by
     * the order column.
     * @private
     * @returns {Promise<>} - All questions from the nutrition survey that the user has not answered.
     * @author Junior Javier Brito Perez
     */
    #getNutritionSurvey() {
        //TODO: Implement bearer token authentication instead of using the userId in the url.
        this.#app.get("/survey/nutrition/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId
                            FROM question
                                     INNER JOIN questionType ON question.questionTypeId = questionType.id
                            WHERE question.surveyId = 1
                              AND question.id NOT IN (SELECT questionId
                                                      FROM answer
                                                               INNER JOIN response ON response.id = answer.responseId
                                                      WHERE response.userId = ?)
                            ORDER BY question.order;`,
                    values: [req.params.userId]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Gets all options for a question. The options are ordered by the order column.
     * @private
     * @returns {Promise<>} - All options for a question.
     * @author Junior Javier Brito Perez
     */
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

    /**
     * Puts the survey result in the database. The survey result is a JSON object with the following structure:
     * @private
     * @example
     * {
     *  "surveyId": 1,
     *  "data": [
     *      {
     *      "id": 1,
     *      "options": [
     *          {
     *           "optionId": 1,
     *           "text": "Option 1"
     *          },
     *          {
     *           "optionId": 2,
     *           "text": "Option 2"
     *          }
     *        ]
     *      },
     * }
     * @returns {Promise<>}
     * @author Junior Javier Brito Perez
     */
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

                if (answersOptions.length > 0) {
                    await this.#databaseHelper.handleQuery({
                        query: `INSERT INTO answeroption (id, answerId, questionOtionId, answeroption.text)
                                values ?;`,
                        values: [answersOptions]
                    });
                }

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    failure: false,
                    message: "Vragenlijst antwoorden opgeslagen!"
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    reason: e,
                    failure: true,
                    message: "Er is iets fout gegaan bij het opslaan van de vragenlijst antwoorden."
                });
            }
        });
    }

    /**
     * @author Jayden.G
     * Sets the status of the surveyCompletion to complete for a user.
     *
     * @returns {Promise<boolean>}
     * @private
     */

    #setSurveyComplete() {
        this.#app.put("/survey/status/complete/:userId", async (req, res) => {
            try {
                const userId = req.params.userId;

                await this.#databaseHelper.handleQuery({
                    query: `UPDATE user
                            SET completedSurvey = 1
                            WHERE id = ?`,
                    values: [userId]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    failure: false,
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    failure: true,
                    reason: e
                });
            }
        });
    }

    /**
     * @author Jayden.G
     * Sets the status of the surveyCompletion to incomplete for a user.
     *
     * @returns {Promise<boolean>}
     */

    #setSurveyIncomplete() {
        this.#app.put("/survey/status/incomplete/:userId", async (req, res) => {
            try {
                const userId = req.params.userId;

                await this.#databaseHelper.handleQuery({
                    query: `UPDATE user
                            SET completedSurvey = 0
                            WHERE id = ?`,
                    values: [userId]
                });

                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    failure: false,
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    failure: true,
                    reason: e
                });
            }
        });
    }

    /**
     * @author Jayden.G
     * Gets the status of the surveyCompletion for a user.
     *
     * @returns {Promise<boolean>}
     * @private
     */

    #getSurveyStatus() {
        this.#app.get("/survey/status/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT completedSurvey
                            FROM user
                            WHERE id = ?;`,
                    values: [req.params.userId]
                });

                if (data.length === 0) {
                    res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                        reason: "No completion status found for this user"
                    });
                } else {
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({
                        "survey_status": data[0].completedSurvey
                });
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({
                    failure: true,
                    reason: e
                });
            }
        });
    }
}

module.exports = surveyRoutes;
