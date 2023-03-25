
class VragenlijstRoutes {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;

        this.#createVragenlijst();
    }

    #createVragenlijst(){
        this.#app.post("/vragenlijst", async (req, res) => {
            try{
              const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT questionText FROM question"
                });

              if(data.insertId){
                  res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
              }
            } catch(e){
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        })
    }
}

//Hiermee laad je het in
module.exports = VragenlijstRoutes;