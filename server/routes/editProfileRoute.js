/**
 * The ProfileRoutes class is responsible for handling profile-related routes,
 * allowing users to update their profile data and retrieve it.
 *
 * @class ProfileRoutes
 * @author Joey_Poel
 * @requires mysql/lib/protocol/packets
 */
const {RowDataPacket} = require("mysql/lib/protocol/packets");

class profileRoutes {
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
        this.#sendData()
        // this.#getData()
    }

    /**
     * Sends updated profile data to the database.
     *
     * @private
     * @function #sendData
     */
    #sendData() {
        this.#app.put("/editProfile", this.#JWTHelper.verifyJWTToken, async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `UPDATE user SET firstname = ?, surname = ?, emailAddress = ?, date_of_birth = ?, weight = ?, height = ? WHERE id = ?`,
                    // values: ["TEST", "TEST", "2005-01-31", "TEST@GMAIL.COM", "100", "100"]
                    values: [req.body.firstname, req.body.surname, req.body.email, req.body.age, req.body.weight, req.body.height, req.user.userId]
                })
                res.status(this.#errorCodes.HTTP_OK_CODE).json({data});
            }
                catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }
    /**
     * (Optional) Retrieves profile data from the database.
     * Uncomment the code and constructor call to enable this function.
     *
     * @private
     * @function #getData
     */
    // TEST FUNCTION TO SEE IF IT ACTUALLY CHANGES THE VALUES, TO MAKE IT WORK UNCOMMENT FOLLOWING CODE AND UNCOMMENT THE LINE IN CONSTRUCTOR THAT CALLS THIS FUNCTION
    // #getData() {
    //     this.#app.get("/editProfile", async (req, res) => {
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `SELECT firstname, surname, date_of_birth, emailAddress, weight, height
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
