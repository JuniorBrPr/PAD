/**
 * This class contains ExpressJS routes specific for the users entity
 * this file is automatically loaded in app.js
 *
 * @author Pim Meijer
 */
class UsersRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #JWTHelper = require("../framework/utils/JWTHelper");
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the users entity
        this.#login()
    }

    /**
     * Checks if passed username and password are found in db, if so let the front-end know
     * @private
     */
    #login() {
        this.#app.post("/users/login", async (req, res) => {
            const emailAddress = req.body.emailAddress;
            //TODO: You shouldn't save a password unencrypted!! Improve this by using this.#cryptoHelper functions :)
            const enteredpassword = req.body.password;
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT id, firstname, password, role FROM user WHERE emailAddress = ? ",
                    values: [emailAddress]
                });
                if (data.length === 1) {
                    const storedHashedPassword = data[0].password;
                    const enteredHashedPassword = this.#cryptoHelper.getHashedPassword(enteredpassword);

                    if (storedHashedPassword === enteredHashedPassword) {
                        const payload = {
                            userId: data[0].id,
                            firstname: data[0].firstname,
                            role: data[0].role,
                        };

                        const accessToken = this.#JWTHelper.createJWTToken(payload);

                        console.log(accessToken)

                        res.status(this.#errorCodes.HTTP_OK_CODE).json({
                            accessToken: accessToken,
                        });

                        console.log(`User ${data[0].firstname} logged in`);
                    } else {
                        res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong username or password"});
                        console.log(`User ${emailAddress} tried to login but failed`)
                    }
                } else {
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Wrong username or password"});
                    console.log(`User ${emailAddress} tried to login but failed`);
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = UsersRoutes