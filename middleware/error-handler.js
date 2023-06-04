const { StatusCodes } = require('http-status-codes')
const { customError } = require('../error')

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("<------ I got inside error handler middleware----> ");
    if (err instanceof customError) {
        console.log("<------ I got inside error handler in of if middleware----> ");
        return res.status(err.status).json({ error: err.message })
    }
    console.log("<------ I got inside error handler out of if middleware----> ");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message })
}

module.exports = errorHandlerMiddleware
