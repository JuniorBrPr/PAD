/**
 * Routes file for register
 */

class RegisterRoutes{
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app){
        this.#app = app;


        this.#createRegister();
    }

    #createRegister(){
        this.#app.post("/register", async (req, res) => {
            try{
             const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO user(id, firstname, surname, emailAddress, password) VALUES (?, ?, ?, ?, ?)",//id moet aangepast worden in db
                    values: [50, req.body.firstname, req.body.surname, req.body.emailAddress, req.body.password],
                });

             if(data.insertId){
                 res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
             }
            } catch(e){
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }

        });
    }
}

module.exports = RegisterRoutes;