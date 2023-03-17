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




    constructor(app) {
        this.#app = app;
        //call method per route for the users entity
        this.#sendData()
    }

    #sendData() {
        this.#app.post("/editProfile/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `INSERT INTO user (firstname, surname, date_of_birth, emailAdress, weight, height) VALUES (?,?,?,?,?,?) WHERE userId = ?`,
                    values: [req.body.firstname, req.body.surname, req.body.date_of_birth, req.body.weight, req.body.height, req.params.userId]
                })}
                catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
}

module.exports = profileRoutes
