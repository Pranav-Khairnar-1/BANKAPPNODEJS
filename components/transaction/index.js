const express = require("express")
const transactionRouter = express.Router()
const {
    getAllTransactions: getAllTransactionsController,
    createTransaction: createTransactionController,
    // login : loginController
} = require('./controller/transaction')
const JwtToken = require('../../middleware/jwt')

transactionRouter.get('/', JwtToken.authenticationMiddlewareUser, getAllTransactionsController)
// transactionRouter.post('/login', loginController)

// transactionRouter.get('/qparams', getAllTransactionsQparamsController)
transactionRouter.post('/new', JwtToken.authenticationMiddlewareUser, createTransactionController)
// transactionRouter.get('/:id',JwtToken.authenticationMiddlewareUser, getTransactionByIDController)
// transactionRouter.put('/update/:id',JwtToken.authenticationMiddlewareUser, updateTransactionByIDController)
// transactionRouter.delete('/delete/:id',JwtToken.authenticationMiddlewareUser, deleteTransactionByIDController)



module.exports = transactionRouter