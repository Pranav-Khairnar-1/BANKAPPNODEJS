
const jwt = require('jsonwebtoken')
const customError = require('../../../error')


const authenticationAdmin = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        const authHeader2 = req.headers.cookie;
        console.log("THIS IS THE COOOKIE I FOUND ----------------->", authHeader2)

        if (!authHeader) {
            throw new customError.authorizationError("token not provided");
        }
        const token = authHeader

        const decoded = jwt.verify(token, "GOD");
        if (!decoded.isAdmin) {
            throw new customError.authorizationError("Must Login as Admin to do this operation.");
        }
        console.log(" message", decoded);
        res.status(200).json({ flag: true })
    } catch (error) {
        console.log(error);
        console.log("<------ I got inside Catch of authorization error ----> ");

        // throw new customError.authorizationError("route cannot be acccessed");
        next(error)
    }
}
const authenticationUser = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new customError.authorizationError("token not provided");
        }
        const token = authHeader

        const decoded = jwt.verify(token, "GOD");
        if (!decoded.isAdmin) {
            throw new customError.authorizationError("Must Login as User to do this operation.");
        }
        console.log(" message", decoded);
        res.status(200).json({ flag: true })
    } catch (error) {
        console.log(error);
        console.log("<------ I got inside Catch of authorization error ----> ");

        // throw new customError.authorizationError("route cannot be acccessed");
        next(error)
    }
}

module.exports = {
    authenticationAdmin,
    authenticationUser
}