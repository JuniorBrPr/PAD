/**
 * Routes file for register.
 * This file checks if user already exists and makes a new user in the database
 * @author Hanan Ouardi
 */

class RegisterRoutes {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #cryptoHelper = require("../framework/utils/cryptoHelper");

    /**
     * Constructs a new RegisterRoutes object.
     * @param {Object} app - The Express application object.
     */
    constructor(app) {
        this.#app = app;

        this.#createRegister();
        this.#getEmailExists();
    }

    /**
     * Handles the "/register/check-email" endpoint for checking if an email already exists in the database.
     * @private
     * @author Hanan Ouardi
     */
    #getEmailExists() {
        this.#app.post("/register/check-email", async (req, res) => {
            try {
                const emailExists = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM user WHERE emailAddress = ?",
                    values: [req.body.emailAddress],
                });
                if (emailExists.length === 1) {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: "Email already exists"});
                    return;
                }
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({reason: 'Everything is gucci'})
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }

    /**
     * Handles the "/register" endpoint for registering a new user.
     * @private
     * @author Hanan Ouardi
     **/
    #createRegister() {
        this.#app.post("/register", async (req, res) => {
            try {
                const password = this.#cryptoHelper.getHashedPassword(req.body.password)
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO user(firstname, surname, emailAddress, password) VALUES ( ?, ?, ?, ?)",
                    values: [req.body.firstname, req.body.surname, req.body.emailAddress, password],
                });
                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = RegisterRoutes;
