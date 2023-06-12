const express = require("express")
const customerRouter = express.Router()
const {
    getAllCustomers: getAllCustomersController,
    createCustomer: createCustomerController,
    getCustomerByID: getCustomerByIDController,
    updateCustomerByID: updateCustomerByIDController,
    deleteCustomerByID: deleteCustomerByIDController,
    login : loginController
} = require('./controller/customer')
const JwtToken = require('../../middleware/jwt')

customerRouter.get('/',JwtToken.authenticationMiddlewareAdmin,getAllCustomersController)
customerRouter.post('/login', loginController)

// customerRouter.get('/qparams', getAllCustomersQparamsController)
customerRouter.post('/new',JwtToken.authenticationMiddlewareAdmin, createCustomerController)
customerRouter.get('/:id', getCustomerByIDController)
customerRouter.put('/update/:id',JwtToken.authenticationMiddlewareAdmin, updateCustomerByIDController)
customerRouter.delete('/delete/:id',JwtToken.authenticationMiddlewareAdmin, deleteCustomerByIDController)



module.exports = customerRouter