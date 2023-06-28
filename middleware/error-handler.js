const { StatusCodes } = require('http-status-codes')
const { customError } = require('../error')

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("<------ I got inside error handler middleware----> ");

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(err.status).json({ error: "JSON Object is Invalid, please Check syntax" })
    }
    if (err instanceof customError) {
        console.log("<------ I got inside error handler in of if middleware----> ");
        return res.status(err.status).json({ error: err.message })
    }
    console.log("<------ I got inside error handler out of if middleware----> ");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message })
}

module.exports = errorHandlerMiddleware
