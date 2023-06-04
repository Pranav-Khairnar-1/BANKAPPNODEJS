class CustomError extends Error {
    constructor(message,statusCOde) {
        super(message)
        this.status = statusCOde
    }
}

module.exports = CustomError