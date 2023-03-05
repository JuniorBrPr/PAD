/**
 *
 * @author Jayden Gunhan
 */

class ActivityRoute {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;

    constructor(app) {
        this.#app = app;

        this.#getRoomById();
    }

    /**
     * dummy data example endpoint - rooms (welcome screen)
     * get request, data is sent by client via url - req.params
     * @private
     */

    #getRoomById() {
        this.#app.get("/user_goal/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT id, userId, activityId, amount, dayOfWeek FROM user_goal WHERE id = ?",
                    values: [req.params.userId]
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ActivityRoute