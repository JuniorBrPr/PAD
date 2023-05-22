/**
 * This class contains ExpressJS routes specific for the admin entity
 * this file is automatically loaded in app.js
 *
 * @author Jayden.G
 */

class adminRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #app

    /**
     * Initializes a new instance of the ProfileRoutes class.
     *
     * @constructor
     * @param {object} app - The Express application instance.
     */

    constructor(app) {
        this.#app = app;
    }
}

module.exports = adminRoute;
