const CustomError = require("./customError")

class ValidationError extends CustomError {
    constructor(errMessage) {
        super(errMessage, 422)
        // this.message = errMessage
    }
}

module.exports = ValidationError