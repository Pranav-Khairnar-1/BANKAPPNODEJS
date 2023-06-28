const customError = require('./customError')
const validationError = require('./validationError')
const authorizationError = require('./authenticationError')
const databaseError = require('./databaseError')

module.exports = {
    customError,
    validationError,
    authorizationError,
    databaseError
}