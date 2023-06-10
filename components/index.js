const express = require("express")
const router = express.Router()
const customerRouter = require('./customer/index')
const accountRouter = require('./account/index')
const bankRouter = require('./bank/index')
const transactionRouter = require('./transaction/index')
const authRouter = require('./loginAuth')

router.use('/customer', customerRouter)
router.use('/account', accountRouter)
router.use('/bank', bankRouter)
router.use('/transaction', transactionRouter)
router.use('/auth', authRouter)


module.exports = router