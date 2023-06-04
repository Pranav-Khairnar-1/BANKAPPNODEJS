const express = require("express")
const router = express.Router()
const customerRouter = require('./customer/index')

router.use('/customer', customerRouter)
router.use('/account', customerRouter)
router.use('/bank', customerRouter)


module.exports = router