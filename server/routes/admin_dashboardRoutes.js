class Admin_dashboardRoutes {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper");
    #httpsErrorCodes = require("../framework/utils/httpErrorCodes");


    constructor(app) {
        this.#app = app;

        this.#createQuestion();
    }

    #createQuestion() {

        this.#app.post("/admin_dashboard", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO question(id, surveyId, questionTypeId, order, questionText) VALUES(?,?,?,?,?)",
                    values: [req.body.id, req.body.surveyId, req.body.questionTypeId, req.body.order, req.body.questionText]
                });

                if(data.insertId) {
                    res.status(this.#httpsErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
                }

            } catch (e) {
                res.status(this.#httpsErrorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        })
    }
}

module.exports = Admin_dashboardRoutes;
