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

    #firstname
    #surname
    #date_of_birth
    #emailAdress
    #weight
    #height


    constructor(app) {
        this.#app = app;
        //call method per route for the users entity
        this.#getData()
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
                    this.#firstname = {"firstname": data[0].firstname}
                    this.#surname = {"surname": data[0].surname}
                    this.#date_of_birth = {"date_of_birth": data[0].date_of_birth}
                    this.#emailAdress = {"emailAdress": data[0].emailAdress}
                    this.#weight = {"weight": data[0].weight}
                    this.#height = {"height": data[0].height}
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

    get firstname() {
        return this.#firstname;
    }

    get surname() {
        return this.#surname;
    }

    get date_of_birth() {
        return this.#date_of_birth;
    }

    get emailAdress() {
        return this.#emailAdress;
    }

    get weight() {
        return this.#weight;
    }

    get height() {
        return this.#height;
    }
}

module.exports = profileRoutes
