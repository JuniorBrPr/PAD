/**
 * This class contains ExpressJS routes specific for the admin entity
 * this file is automatically loaded in app.js
 *
 * @class
 * @author Jayden.G
 */

class adminRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #constant = require("../framework/utils/constantSheet")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #csvHelper = require('../framework/utils/csvHelper');

    #app

    /**
     * @author Jayden.G
     * Initializes a new instance of the adminRoute class.
     *
     * @constructor
     * @param {Object} app - The Express application instance.
     */

    constructor(app) {
        this.#app = app;

        this.getSurveyResults();
        this.getNutritionSurveyContent();
        this.getExerciseSurveyContent();
    }

    /**
     * @author Jayden.G
     * Route for getting survey results.
     *
     * Access is restricted to authenticated users.
     */

    getSurveyResults() {
        this.#app.get("/admin/survey_data", this.#JWTHelper.verifyJWTToken, async (req, res) => {

            if (!req.user.role) {
                console.log(`User ${req.user.firstname} id: ${req.user.userId} tried to access admin route`);
                res.status(this.#errorCodes.FORBIDDEN_CODE).json({reason: "Unauthorized request"});
                return;
            }

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT user.id                  AS User,
                                   DATE(user.date_of_birth) AS Birthdate,
                                   user.height              AS Height,
                                   user.weight              AS Weight,
                                   survey.name              AS Survey,
                                   question.questionText    AS Question,
                                   answer.answer            AS Answer
                            FROM user
                                     JOIN response ON user.id = response.userId
                                     JOIN answer ON response.id = answer.responseId
                                     JOIN question ON answer.questionId = question.id
                                     JOIN survey ON question.surveyId = survey.id
                            ORDER BY user.id;`
                });

                const privatizedData = this.#csvHelper.privatizeIdentifiers(data)

                const csvData = this.#csvHelper.convertToCSV(privatizedData);

                res.status(this.#errorCodes.HTTP_OK_CODE).json({csvData});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * @author Jayden.G
     * Route for getting content of the nutrition survey.
     *
     * Access is restricted to authenticated users.
     */

    getNutritionSurveyContent() {
        this.#app.get("/admin/survey_content/nutrition", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const questions = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionTypeId        AS typeId,
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId
                            FROM question
                            INNER JOIN questionType ON question.questionTypeId = questionType.id
                            WHERE question.surveyId = ?
                            ORDER BY question.order;`,
                    values: [this.#constant.SURVEY_TYPE.Nutrition]
                });

                for(const question of questions) {
                    question.answers = await this.#databaseHelper.handleQuery({
                        query: `SELECT questionoption.value
                                FROM questionoption
                                         JOIN question ON questionoption.questionId = question.id
                                WHERE question.surveyId = ? AND question.id = ?;`,
                        values: [question.surveyId, question.id]
                    });
                }

                res.status(this.#errorCodes.HTTP_OK_CODE).json(questions);
            } catch (e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e.message});
            }
        });
    }

    /**
     * @author Jayden.G
     * Route for getting content of the exercise survey.
     *
     * Access is restricted to authenticated users.
     */

    getExerciseSurveyContent() {
        this.#app.get("/admin/survey_content/exercise", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const questions = await this.#databaseHelper.handleQuery({
                    query: `SELECT question.id           AS id,
                                   question.questionText AS text,
                                   questionTypeId        AS typeId,
                                   questionType.type     AS type,
                                   question.surveyId     AS surveyId
                            FROM question
                            INNER JOIN questionType ON question.questionTypeId = questionType.id
                            WHERE question.surveyId = ?
                            ORDER BY question.order;`,
                    values: [this.#constant.SURVEY_TYPE.Exercise]
                });

                for(const question of questions) {
                    question.answers = await this.#databaseHelper.handleQuery({
                        query: `SELECT questionoption.value
                                FROM questionoption
                                         JOIN question ON questionoption.questionId = question.id
                                WHERE question.surveyId = ? AND question.id = ?;`,
                        values: [question.surveyId, question.id]
                    });
                }

                res.status(this.#errorCodes.HTTP_OK_CODE).json(questions);
            } catch (e) {
                console.error(e);
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e.message});
            }
        });
    }
}

module.exports = adminRoute;
