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
        this.#sendData()
        // this.#getData()
    }

    #sendData() {
        this.#app.put("/editProfile/:userId", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user SET firstname = ?, surname = ?, emailAdress = ?, date_of_birth = ?, weight = ?, height = ? WHERE id = ?`,
                    // values: ["TEST", "TEST", "2005-01-31", "TEST@GMAIL.COM", "100", "100"]
                    values: [req.body.firstname, req.body.surname, req.body.email, req.body.age, req.body.weight, req.body.height, req.params.userId]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            }
                catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    // TEST FUNCTION TO SEE IF IT ACTUALLY CHANGES THE VALUES, TO MAKE IT WORK UNCOMMENT FOLLOWING CODE AND UNCOMMENT THE LINE IN CONSTRUCTOR THAT CALLS THIS FUNCTION
    // #getData() {
    //     this.#app.get("/editProfile/:userId", async (req, res) => {
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `SELECT firstname, surname, date_of_birth, emailAdress, weight, height
    //                         FROM user
    //                         WHERE id = ?`,
    //                 values: [1] // VUL HIER DE ID MET DE HAND IN
    //             });
    //             //if we founnd one record we know the user exists in users table
    //             if (data.length === 1) {
    //                 // Values individually saved
    //                 res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
    //             } else {
    //                 //wrong username
    //                 res.status(this.#errorCodes.AUTHORIZATION_ERROR_CODE).json({reason: "Gebruiker bestaat niet"});
    //             }
    //         } catch (e) {
    //             res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
    //         }
    //     });
    // }
}

module.exports = profileRoutes
