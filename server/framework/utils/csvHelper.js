/**
 * Helper for generating and verifying JWT tokens
 * @author Jayden.G
 */

class csvHelper {
    #csv = require("json2csv");

    /**
     * @author Jayden.G
     * Function to convert json data to csv
     *
     * @param jsonData The json data to be converted to csv
     * @returns {string|null} The converted csv data
     */

    convertToCSV(jsonData) {
        try {
            if (jsonData.length === 0) {
                return null;
            }

            //generate field names from keys in our json data
            const fields = Object.keys(jsonData[0]);

            return this.#csv.parse(jsonData, {fields});
        } catch (err) {
            throw new Error(err);
        }
    }
}

//instantiate directly to enforce one instance of this class
module.exports = new csvHelper();