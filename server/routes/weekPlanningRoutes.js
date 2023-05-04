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


            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT activityId FROM usergoal WHERE activityId = ?",
                    values: [req.body.activityId]
                });
                if(data.insertId){
                    res.status(this.#errorCodes.HTTP_OK_CODE)
                }
            }
            catch(e){

            }

        });
    }
}
    module.exports = weekPlanningRoutes