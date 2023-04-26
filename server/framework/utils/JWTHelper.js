/**
 * Helper for generating and verifying JWT tokens
 * @author Jayden.G
 */

class JWTHelper {
    jwt = require("jsonwebtoken");

    #ACCESS_TOKEN_SECRET = 'wokeupinanewbugatti39bb754cd1c959d42fcc8804aa42a9adaf3c779ff8d93219029bc3c9eb700dd691ccaf6a241cb580f87e558f1d83d33e4184f0c89b04d'

    /**
     * @author Jayden.G
     * Generates a JWT token with the provided payload
     *
     * @param payload The payload to be encoded in the token
     * @returns {*} The generated token
     */

    createJWTToken(payload) {
        return this.jwt.sign(payload, this.#ACCESS_TOKEN_SECRET, {expiresIn: '30d'});
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
        if (token == null) return res.sendStatus(401);

        this.jwt.verify(token, this.#ACCESS_TOKEN_SECRET, (e, user) => {

            //forbidden (invalid signature)
            if (e) return res.sendStatus(403);

            req.user = user;
            next();
        })
    }
}

//instantiate directly to enforce one instance of this class
module.exports = new JWTHelper();