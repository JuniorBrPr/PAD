/**
 * This class contains ExpressJS routes specific for the activity entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden.G
 */

class ActivityRoute {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;

    constructor(app) {
        this.#app = app;

        this.#getGoalTemplates();
        this.#createUserGoal();
    }

    /**
     * @author Jayden.G & Junior.B
     * Creates a new user goal.
     *
     * Inserts selected goals into the 'usergoal' table in the database.
     * @throws {Error} If there is an error during the database query execution.
     * @private
     */

    #createUserGoal() {
        this.#app.put("/activity/create", async (req, res) => {
            // const data = req.body;
            try {
            //     console.log(data[0]);
            //     let entry = [];
            //     for (let i = 0; i < data.length; i++) {
            //         entry.push(
            //             data[i].userId,
            //             parseInt(data[i].activityId),
            //             new Date().toISOString().slice(0, 10).replace('T', ' '),
            //             parseInt(data[i].dayOfTheWeek),
            //             parseInt(data[i].valueChosenByUser)
            //         );
            //     }
            //     console.log(entry);
            //
            //     await this.#databaseHelper.handleQuery({
            //         query: `INSERT INTO usergoal(userId, activityId, dateMade, dayOfTheWeek, valueChosenByUser)
            //                 values (?);`,
            //         values: data[0]
            //     });
                res.status(this.#errorCodes.HTTP_OK_CODE);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    /**
     * @author Jayden.G
     * Retrieves goal templates.
     *
     * Fetches goal template data from the 'goaltemplate' and 'activity' tables in the database which
     * we end up putting into the template in selectGoal.html, this is handled in the activitycontroller.
     * @throws {Error} If there is an error during the database query execution.
     * @private
     */

    #getGoalTemplates() {
        this.#app.get("/activity/templates", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT gt.baseValue,
                                   a.name,
                                   a.description,
                                   a.unit,
                                   a.id
                            FROM goaltemplate gt
                                     INNER JOIN activity a ON gt.activityId = a.id;`,
                    values: null
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ActivityRoute