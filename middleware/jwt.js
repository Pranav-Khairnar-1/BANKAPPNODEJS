const jwt = require('jsonwebtoken')
const customError = require('../error')
const customerView = require('../view/customer')

class jwttoken {
    constructor(id, username, isAdmin) {
        this.id = id
        this.username = username
        this.isAdmin = isAdmin
    }

    createPayload() {
        return {
            ID: this.id,
            username: this.username,
            isAdmin: this.isAdmin,
        }
    }

    generateToken() {
        console.log("data", this)
        const token = jwt.sign(JSON.stringify(this), "GOD")
        console.log("token", token)
        return token
    }

    static authenticateCookie(req, res, next) {
        let cookie = req.cookies

        if (!cookie) {
            throw new customError.authorizationError("Session cookie not found. Please login")
        }

        try {
            let decode = jwt.verify(cookie['authorization'], "GOD")
            console.log(decode);
            next()
        } catch (error) {
            console.error(error);
            throw customError.authorizationError("Session expired. Please login again")
        }
    }

    static authenticationMiddlewareAdmin = async (req, res, next) => {

        try {
            const authHeader = req.headers.authorization;
            const authHeader2 = req.headers.cookie;
            console.log("THIS IS THE COOOKIE I FOUND ----------------->", authHeader2)

            if (!authHeader) {
                throw new customError.authorizationError("token not provided");
            }
            const token = authHeader

            const decoded = jwt.verify(token, "GOD");
            console.log("Authtoken",decoded);
            const flag = await customerView.getCustomerByIDMiddleware(decoded.id)
            if (!decoded.isAdmin) {
                throw new customError.authorizationError("Must Login as Admin to do this operation.");
            }
            console.log(" message", decoded);
            next();
        } catch (error) {
            console.log(error);
            console.log("<------ I got inside Catch of authorization error ----> ");

            // throw new customError.authorizationError("route cannot be acccessed");
            next(error)
        }
    }
    static authenticationMiddlewareUser = async (req, res, next) => {

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new customError.authorizationError("token not provided");
            }
            const token = authHeader

            const decoded = jwt.verify(token, "GOD");
            if (decoded.isAdmin) {
                throw new customError.authorizationError("Must Login as User to do this operation.");
            }
            console.log(" message", decoded);
            next();
        } catch (error) {
            console.log(error);
            console.log("<------ I got inside Catch of authorization error ----> ");

            // throw new customError.authorizationError("route cannot be acccessed");
            next(error)
        }
    }
}

module.exports = jwttoken