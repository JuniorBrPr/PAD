/**
 *This file contains the routes for the survey. The routes are used to get all questions, get all questions for the
 *nutrition survey, get the options for a question and put the survey result.
 *
 *@author Junior Javier Brito Perez
 */
class surveyRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #app

    constructor(app) {
        this.#app = app;

        this.#getAllQuestions();
        this.#putSurveyResult();
        this.#getUnansweredSurveys();
        this.#getSurvey();
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
        this.#app.get("/survey/answered", this.#JWTHelper.verifyJWTToken, async (req, res) => {

            const userId = req.user.userId;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT survey.id AS id
                            FROM survey
                                     INNER JOIN question
                                                ON survey.id = question.surveyId
                            WHERE question.id NOT IN (SELECT questionId
                                                      FROM answer
                                                               INNER JOIN response
                                                                          ON response.id = answer.responseId
                                                      WHERE response.userId = ?)
                            GROUP BY survey.id;`,
                    values: [userId]
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
     * Gets all questions from the survey that the use has not answered. The questions are ordered by
     * the order column.
     * @private
     * @returns {Promise<>} - All questions from the survey that the user has not answered.
     * @author Junior Javier Brito Perez
     */
    #getSurvey() {
        this.#app.post("/survey/questions", this.#JWTHelper.verifyJWTToken, async (req, res) => {

            const userId = req.user.userId;

            try {
                const response = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId
                            FROM question
                                     INNER JOIN questionType ON question.questionTypeId = questionType.id
                            WHERE question.surveyId = ?
                              AND question.id NOT IN (SELECT questionId
                                                      FROM answer
                                                               INNER JOIN response ON response.id = answer.responseId
                                                      WHERE response.userId = ?)
                            ORDER BY question.order;`,
                    values: [req.body.surveyId, userId]
                });

                const options = await this.#databaseHelper.handleQuery({
                    query: `SELECT questionoption.id         AS id,
                                   questionoption.questionId as questionId,
                                   questionoption.value      AS text,
                                   questionoption.openOption AS open
                            FROM questionoption
                            WHERE questionId IN (?)
                            ORDER BY questionoption.order;`,
                    values: [response.map(question => question.id)]
                });

                for (let i = 0; i < response.length; i++) {
                    response[i].options = options.filter(option => option.questionId === response[i].id);
                }

                res.status(this.#errorCodes.HTTP_OK_CODE).json(response);
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
     *      "answer": "Yes"
     *      },
     * }
     * @returns {Promise<>}
     * @author Junior Javier Brito Perez
     */
    #putSurveyResult() {
        this.#app.put("/survey/response", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = req.body;
                const userId = req.user.userId;

                const responseId = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO response (id, surveyId, userId)
                            values (?, ?, ?);
                    SELECT response.id
                    FROM response
                    WHERE userId = ?
                      AND surveyId = ?;`,
                    values: [0, data.surveyId, userId, userId, data.surveyId]
                }).then((result) => {
                    if (result[1].length === 0) {
                        throw "No response found";
                    }
                    return result[1][0].id;
                })

                let answers = [];
                for (const question of data.data) {
                    answers.push([null, responseId, question.questionId, question.answer]);
                }

                if (data.surveyId === 1) {
                    let questionIds = [];
                    for (const question of data.data) {
                        questionIds.push([question.questionId]);
                    }
                    const s = await this.#databaseHelper.handleQuery({
                        query: `SELECT question.id      AS id,
                                       naa.portion_size AS portionSize,
                                       a.unit           AS unit
                                FROM question
                                         INNER JOIN activity a on a.id = question.activityId
                                         INNER JOIN nutrition_activity_attribute naa on a.id = naa.activityId
                                         INNER JOIN nutrition_category nc on nc.id = naa.category_id
                                WHERE question.id IN (?)
                                GROUP BY question.id;`,
                        values: [questionIds]
                    });

                    for (let i = 0; i < s.length; i++) {
                        for (let j = 0; j < answers.length; j++) {
                            if (s[i].id === answers[j][2]) {
                                answers[j][3] = (answers[j][3] * s[i].portionSize) + " " + s[i].unit + " per week";
                            }
                        }
                    }
                }

                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO answer (id, responseId, questionId, answer)
                            VALUES ?`,
                    values: [answers]
                });

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
        this.#app.put("/survey/status/complete", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const userId = req.user.userId;

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
        this.#app.put("/survey/status/incomplete", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const userId = req.user.userId;

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
        this.#app.get("/survey/status", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {

                const userId = req.user.userId;

                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT completedSurvey
                            FROM user
                            WHERE id = ?;`,
                    values: [userId]
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
