/**
 *
 * @author Hanan Ouardi
 */

class WeekPlanningRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app


    constructor(app) {
        this.#app = app;

        this.#dataWeekPlanning()
    }

    #dataWeekPlanning() {
        this.#app.get("/planning", async (req, res) => {
            // res.json({"message": "Api werkt" });
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT name FROM activity `,
                    values: []
                });

                    res.status(this.#errorCodes.HTTP_OK_CODE).json(data);

            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }

        });
    }
}

module.exports = WeekPlanningRoutes;