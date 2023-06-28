const CustomError = require("./customError")

class databaseError extends CustomError {
    constructor(errMessage) {
        super(errMessage, 520)
        // this.message = errMessage
    }
}

module.exports = databaseError