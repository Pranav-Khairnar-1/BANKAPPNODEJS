const express = require("express")
const accountRouter = express.Router()
const {
    getAllAccounts: getAllAccountsController,
    createAccount: createAccountController,
    getAccountByID: getAccountByIDController,
    deleteAccountByID: deleteAccountByIDController,
    getAllAccountsAdmin: getAllAccountsAdminController
} = require('./controller/account')
const JwtToken = require('../../middleware/jwt')

accountRouter.get('/admin/', getAllAccountsAdminController)
accountRouter.get('/:customerID', getAllAccountsController)
accountRouter.post('/new', JwtToken.authenticationMiddlewareUser, createAccountController)
accountRouter.get('/:id', JwtToken.authenticationMiddlewareUser, getAccountByIDController)
accountRouter.delete('/delete/:id', JwtToken.authenticationMiddlewareUser, deleteAccountByIDController)



module.exports = accountRouter