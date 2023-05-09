/**
 * Route weekplanning
 *
 * @author Hanan Ouardi
 */

class WeekPlanningRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app
    constructor(app) {
        this.#app = app;

        this.#dataWeekPlanning();
        this.#userWeekPlanning();
    }
    #dataWeekPlanning() {
        this.#app.get("/planning", async (req, res) => {
            // res.json({"message": "Api werkt" });
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT name
                            FROM activity `, values: []
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
    #userWeekPlanning() {
        this.#app.post("/planning", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO weeklytableuser(id, date, done, notDone) VALUES (?, ?, ?, ?)",
                    values: [req.body.id, req.body.date, req.body.done, req.body.notDone],
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = WeekPlanningRoutes;