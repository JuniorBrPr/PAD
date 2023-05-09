/**
 * Helper for generating and verifying JWT tokens
 * @author Jayden.G
 */

class JWTHelper {
    #jwt = require("jsonwebtoken");
    #errorCodes = require("./httpErrorCodes");

    /**
     * @author Jayden.G
     * Generates a JWT token with the provided payload
     *
     * @param payload The payload to be encoded in the token
     * @returns {*} The generated token
     */

    createJWTToken(payload) {
        return this.#jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30d'});
    }

    /**
     * @author Jayden.G
     * Middleware function to verify the JWT token in the request header
     *
     * @param req The request
     * @param res The response
     * @param next For going to the next function
     * @returns {*}
     */

    verifyJWTToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        //unauthorized
        if (token == null) return res.sendStatus(this.#errorCodes.AUTHORIZATION_ERROR_CODE);

        this.#jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, user) => {

            //forbidden (invalid signature)
            if (e) return res.sendStatus(this.#errorCodes.FORBIDDEN_CODE);

            req.user = user;

            console.log(`userid ${user.userId} - ${user.firstname} making request...`);

            next();
        })
    }
}

//instantiate directly to enforce one instance of this class
module.exports = new JWTHelper();