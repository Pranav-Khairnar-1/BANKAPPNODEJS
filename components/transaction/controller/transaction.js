const { StatusCodes } = require('http-status-codes')
const Transactions = require('../../../view/bank')
const {
    getAllTransactions: getAllTransactionService,
    createTransactions: createTransactionsService,
} = require('../service/transaction')





const getAllTransactions = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getAllTransactionss controller Started>>>>>>>>");
        const filterGod = req.query; // Extract query parameters
        console.log("This is query god filter in controller ------>", filterGod)
        // Array to store filters dynamically
        const filters = [];

        // Iterate over query parameters
        for (const key in filterGod) {
            if (filterGod.hasOwnProperty(key)) {
                const value = filterGod[key];
                // Build filters dynamically based on query parameters
                filters.push({ field: key, value: value });
            }
        }
        console.log("for loop ended ------>", filters)

        let allTransactionss = await getAllTransactionService(filters)
        console.log("Service returned------>", allTransactionss)

        // if (!allTransactionss) {
        //     resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
        //     return
        // }
        console.log(">>>>>>>>>getAllTransactionss controller Ended>>>>>>>>");

        resp.status(StatusCodes.OK).json(allTransactionss)

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const createTransaction = async (req, resp) => {
    try {
        console.log(">>>>>>>>>createTransactions controller Started>>>>>>>>");
        const transaction = new Transactions(req.body)
        console.log("body of create------>", req.body)
        console.log("this is transaction in  create transaction----->", transaction)
        // transaction.Validate()
        let transactionOBJ = await createTransactionsService(transaction)
        resp.status(StatusCodes.OK).json(transactionOBJ)
        console.log(">>>>>>>>>createTransactions controller Ended>>>>>>>>");

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)

    }
}


module.exports = {
    getAllTransactions,
    createTransaction,
    // login
}