/**
 * This class contains ExpressJS routes specific for the home entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden.G
 */


class HomeRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #constant = require("../framework/utils/constantSheet")
    #databaseHelper = require("../framework/utils/databaseHelper");

    constructor(app) {
        this.app = app;

        this.#registerRoutes(); // Register the routes with the Express app
    }

    #registerRoutes() {
        this.app.get("/home/data", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT video, board_message
                            FROM home
                            WHERE id = ?;`,
                    values: [this.#constant.HOME_PAGE.ACTIVE_CONFIG],
                });
                res.status(this.#errorCodes.HTTP_OK_CODE).json({
                    "video": data[0].video,
                    "board_message": data[0].board_message
                });
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }


}

module.exports = HomeRoute;