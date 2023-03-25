class activityFrequencyRoutes {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;

        // this.#getActivityFrequency();
        this.#getSurveyQuestions();
        this.#getFrequencyOptions();
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


}

module.exports = activityFrequencyRoutes;