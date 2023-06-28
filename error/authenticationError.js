const CustomError = require("./customError")

class authenticationError extends CustomError {
    constructor(errMessage) {
        super(errMessage, 403)
        // this.message = errMessage
    }
}

module.exports = authenticationError