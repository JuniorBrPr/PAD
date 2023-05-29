/**
 * Route weekplanning
 *
 * @author Hanan Ouardi
 */

class WeekPlanningRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #app
    constructor(app) {
        this.#app = app;

       // this.#dataWeekPlanning();

         this.#userWeekPlanning();
        this.#userActivities();
       // this.#getGoals();
    }


    // #dataWeekPlanning() {
    //     this.#app.get("/planning", async (req, res) => {
    //         // res.json({"message": "Api werkt" });
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `SELECT name
    //                         FROM activity `, values: []
    //             });
    //             res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
    //         } catch (e) {
    //             res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
    //         }
    //     });
    // }






    #userActivities() {
        this.#app.get("/planning" , this.#JWTHelper.verifyJWTToken, async (req, res) => {
             try {
                 const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT usergoal.userId,
                                   usergoal.valueChosenByUser,
                                   usergoal.dayOfTheWeek,
                                   usergoal.id,
                                   activity.unit,
                                   usergoal.activityId,
                                   activity.name                            
                            FROM usergoal
                                     INNER JOIN activity ON activity.id = usergoal.activityId
                             WHERE usergoal.userId = ?;
                    `,
                     values:  [req.user.userId]
                });
                 if (!Array.isArray(data)) {
                     throw new Error("Invalid data received from the repository");
                 }
                   res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }



    #userWeekPlanning() {
        this.#app.post("/planning", this.#JWTHelper.verifyJWTToken ,async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO goal(userID, completed, date, usergoalID) VALUES (?, ?, ?, ?)" ,
                    values: [req.user.userId, 1, req.body.date, req.body.usergoalID],
                });
               // console.log(req.body.userActivityId);
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }


}

module.exports = WeekPlanningRoutes;