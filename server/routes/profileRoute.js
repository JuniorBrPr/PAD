/**
 * This class gets data of the database and posts it on the website in the according divs on the profile tab
 *
 * @author Joey van der Poel
 */
const {RowDataPacket} = require("mysql/lib/protocol/packets");

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
        this.#postData()
    }

    #getData() {
        this.#app.get("/profile", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT firstname, surname, date_of_birth, emailAdress, weight, height FROM user WHERE id = 1"
                });
                //if we founnd one record we know the user exists in users table
                if (data.length === 1) {
                    // Values individually saved
                    const firstname = {"firstname": data[0].firstname}
                    const surname = {"surname": data[0].surname}
                    const date_of_birth = {"date_of_birth": data[0].date_of_birth}
                    const emailAdress = {"emailAdress": data[0].emailAdress}
                    const weight = {"weight": data[0].weight}
                    const height = {"height": data[0].height}
                    res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
                } else {
                    //wrong username
                    res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Gebruiker bestaat niet"});
                }
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        });
    }


    #postData() {

    }
}

module.exports = profileRoutes
