class activityFrequencyRoutes {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;

        // this.#getActivityFrequency();
        this.#getSurveyQuestions();
        this.#getFrequencyOptions();
        this.#postSurveyAnswers();
    }


//gets the question about how frequently you do an activity
//     #postActivityFrequency() {
//         this.#app.post("/activity/frequency", async (req, res) => {
//             try {
//                 const data = await this.#databaseHelper.handleQuery({
//                     query: "INSERT INTO pad_nut_2_dev.answer" +
//                         "VALUES (?, ?, ?, ?)",
//                     values: []
//                 });
//
//                 if (data.insertId) {
//                     res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
//                 }
//                 return data;
//             } catch (e) {
//                 res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
//             }
//         })
//     }


    #getSurveyQuestions() {
        this.#app.get("/activity/questions", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId
                            FROM question
                                     INNER JOIN questiontype ON question.questionTypeId = questiontype.id
                            WHERE surveyId = 2;`
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
                }
                return res.json(data);
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    #getFrequencyOptions() {
        this.#app.get("/activity/answerOptions", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT questionoption.id         AS id,
                                   questionoption.value      AS text,
                                   questionoption.openOption AS open
                            FROM pad_nut_2_dev.questionoption
                            ORDER BY questionoption.order;`,
                    values: [req.params.questionId]
                });

                if (data.length === 0) {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: "No options found for this question"});
                } else {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    #postSurveyAnswers() {
        this.#app.put("/activity/putAnswers/:userId", async (req, res) => {
            try {
                const data = req.body;
                const userId = req.params.userId;

                // const responseId = await this.#databaseHelper.handleQuery({
                //     query: `INSERT INTO pad_nut_2_dev.response(surveyId, userId)
                //             VALUES (?, ?)`,
                //     values: [req.body.surveyId, userId]
                // });
                // if (data.length === 0) {
                //     res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: "Bad put request"});
                // } else {
                //     res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data);
                // }
                const responseId = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO response (id, surveyId, userId)
                            values (?, 2, ?);
                    SELECT response.id
                    FROM response
                    WHERE userId = ?
                      AND surveyId = 2;`,
                    values: [0, userId, userId]
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

                await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO answeroption (id, answerId, questionOtionId, answeroption.text)
                            values ?;`,
                    values: [answersOptions]
                });

                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({
                    failure: false,
                    message: "Vragenlijst antwoorden opgeslagen!"
                });

            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = activityFrequencyRoutes;