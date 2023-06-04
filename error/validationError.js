const CustomError = require("./customError")

class ValidationError extends CustomError {
    constructor(errMessage) {
        super(errMessage, 400)
        // this.message = errMessage
    }
}

module.exports = ValidationError