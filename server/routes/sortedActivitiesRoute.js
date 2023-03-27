class sortedActivitiesRoute {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper")
    #httpErrorCodes = require("../framework/utils/httpErrorCodes")

    constructor(app) {
        this.#app = app;

        this.#getActivities();
    }


    #getActivities() {
        this.#app.get("/activities/all", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: `SELECT id    AS id,
                                   name AS name,
                                   description   AS description,
                                   unit          AS unit
                            FROM pad_nut_2_dev.activity
                    `
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
                }
                return res.json(data);
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
            }
        })
    }

    // #getDisabilities() {
    //     this.#app.get("/activities/disabilities", async (req, res) => {
    //         try {
    //             const data = await this.#databaseHelper.handleQuery({
    //                 query: `SELECT ...
    //                         FROM pad_nut_2_dev.activity
    //                 `
    //             });
    //
    //             if (data.insertId) {
    //                 res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({id: data.insertId});
    //             }
    //             return res.json(data);
    //         } catch (e) {
    //             res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({reason: e});
    //         }
    //     })
    // }
}

module.exports = sortedActivitiesRoute;