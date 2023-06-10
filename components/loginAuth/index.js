
const {
    authenticationAdmin: authenticationAdminController,
    authenticationUser: authenticationUserController
} = require('./controller/loginAuth')
const express = require("express")

const authRouter = express.Router()

authRouter.get('/admin', authenticationAdminController)
authRouter.get('/user', authenticationUserController)

module.exports = authRouter