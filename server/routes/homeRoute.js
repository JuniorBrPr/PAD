/**
 * This class contains ExpressJS routes specific for the home entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden.G
 */

class HomeRoute {

    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app;
    #activeHomeConfig;

    constructor(app) {
        this.#app = app;
        this.#activeHomeConfig = 1;

        this.#getHomeData();
    }

    #getHomeData() {
        this.#app.get("/home/data", async (res, req) => {
            try {
                const id = this.#activeHomeConfig;

                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT video, board_message
                            FROM home
                            WHERE id = ?;`,
                    values: [id]
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = HomeRoute