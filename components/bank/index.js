const express = require("express")
const bankRouter = express.Router()
const {
    getAllBanks: getAllBanksController,
    createBank: createBankController,
    getBankByID: getBankByIDController,
    updateBankByID: updateBankByIDController,
    deleteBankByID: deleteBankByIDController,
    // login : loginController
} = require('./controller/bank')
const JwtToken = require('../../middleware/jwt')

bankRouter.get('/', getAllBanksController)
// bankRouter.post('/login', loginController)

// bankRouter.get('/qparams', getAllBanksQparamsController)
bankRouter.post('/new', JwtToken.authenticationMiddlewareAdmin, createBankController)
bankRouter.get('/:id', JwtToken.authenticationMiddlewareAdmin, getBankByIDController)
bankRouter.put('/update/:id', JwtToken.authenticationMiddlewareAdmin, updateBankByIDController)
bankRouter.delete('/delete/:id', JwtToken.authenticationMiddlewareAdmin, deleteBankByIDController)



module.exports = bankRouter