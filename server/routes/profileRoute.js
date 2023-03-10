/**
 * This class gets data of the database and posts it on the website in the according divs on the profile tab
 *
 * @author Joey van der Poel
 */
class profileRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #cryptoHelper = require("../framework/utils/cryptoHelper");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //call method per route for the users entity
        this.#getData()
    }


    #getData() {
        this.#app.get("/profile", async (req, res) => {
            const username = req.body.username;
            //TODO: You shouldn't save a password unencrypted!! Improve this by using this.#cryptoHelper functions :)
            const password = req.body.password;

            let name = null;
            let email = null;
            let age = null;
            let weight = null;
            let height = null;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT firstname, surname, date_of_birth, emailAdress, weight, height FROM user WHERE id = 1"
                });
                //NOG NIET NAAR KIJKEN
                //if we founnd one record we know the user exists in users table
                if (data.length === 1) {
                    //return just the username for now, never send password back!
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({"username": data[0].username});
                    name = data[0]
                    email = data[1]
                    age = data[2]
                    weight = data[3]
                    height = data[4]
                } else {
                    //wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Gebruiker bestaat niet"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }
}

module.exports = profileRoutes
