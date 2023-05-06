/**
 * This class contains ExpressJS routes specific for the activity entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden.G
 */

class HomeRoute {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;

    constructor(app) {
        this.#app = app;

        this.#getHomeData();
    }

    #getHomeData() {
        this.#app.get("/home/data", async (res, req) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT video, board_message FROM home;`,
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = HomeRoute