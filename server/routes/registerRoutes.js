/**
 * Routes file for register
 */

class RegisterRoutes{
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")
    #JWTHelper = require("../framework/utils/JWTHelper");

    constructor(app) {
        this.#app = app;


        this.#createRegister();
        this.#getEmailExists();
    }

    // #createRegister() {
    //     this.#app.post("/register", async (req, res) => {
    //         try {
    //             // const emailExists = await this.#databaseHelper.handleQuery({
    //             //     query: "SELECT * FROM user WHERE emailAddress = ?",
    //             //     values: [req.body.emailAddress],
    //             // });
    //             //
    //             // if (emailExists.length > 0) {
    //             //     res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: "Email already exists"});
    //             //     return;
    //             //
    //
    //
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: "INSERT INTO user( firstname, surname, emailAddress, password) VALUES ( ?, ?, ?, ?)",//id moet aangepast worden in db
    //                 values: [req.body.firstname, req.body.surname, req.body.emailAddress, req.body.password],
    //             });
    //
    //
    //             if (data.insertId) {
    //                 res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
    //             }
    //
    //         } catch (e) {
    //             res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
    //         }
    //     });
    // }




    #getEmailExists() {
        this.#app.post("/register/check-email", async (req, res) => {
            try {
                const emailExists = await this.#databaseHelper.handleQuery({
                    query: "SELECT * FROM user WHERE emailAddress = ?",
                    values: [req.body.emailAddress],
                });

                console.log(emailExists)
                console.log(emailExists.length)
                console.log(emailExists.length > 0)
                console.log(emailExists.length === 1)

                if (emailExists.length === 1) {
                    res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: "Email already exists" });
                    return;
                }

                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ reason: 'Everything is gucci' })
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });

    }

    #createRegister() {
        this.#app.post("/register", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO user(firstname, surname, emailAddress, password) VALUES ( ?, ?, ?, ?)",
                    values: [req.body.firstname, req.body.surname, req.body.emailAddress, req.body.password],
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ id: data.insertId });
                }
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

}
    module.exports = RegisterRoutes;
