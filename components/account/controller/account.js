const { StatusCodes } = require('http-status-codes')
const Account = require('../../../view/account')
const {
    getAllAccounts: getAllAccountsService,
    createAccount: createAccountService,
    getAccountByID: getAccountByIDService,
    updateAccountByID: updateAccountByIDService,
    deleteAccountByID: deleteAccountByIDService,
    // login: loginService
    // getAllAccounts: getAllAccountsQparamsService
} = require('../service/account')
// const JwtToken = require('../../../middleware/jwt')
// const  ValidationError  = require('../../../error/validationError')





const getAllAccounts = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getAllAccounts controller Started>>>>>>>>");
        const filterGod = req.query; // Extract query parameters
        let ID = req.params.customerID
        console.log("This is query god filter in controller ------>", filterGod)
        // Array to store filters dynamically
        const filters = [];
        filters.push({
            field: "customerID",
            value: ID
        })

        // Iterate over query parameters
        for (const key in filterGod) {
            if (filterGod.hasOwnProperty(key)) {
                const value = filterGod[key];
                // Build filters dynamically based on query parameters
                filters.push({ field: key, value: value });
            }
        }
        console.log("for loop ended ------>", filters)

        let allAccounts = await getAllAccountsService(filters)
        console.log("Service returned------>", allAccounts)

        console.log(">>>>>>>>>getAllAccounts controller Ended>>>>>>>>");

        resp.status(StatusCodes.OK).json(allAccounts)

    } catch (error) {
        next(error)
    }
}

const createAccount = async (req, resp) => {
    try {
        console.log(">>>>>>>>>createAccount controller Started>>>>>>>>");
        const customer = new Account(req.body)
        console.log("body of create------>", req.body)
        console.log("this is customer in  create customer----->", customer)
        customer.Validate()
        let customerOBJ = await createAccountService(customer)
        resp.status(StatusCodes.OK).json(customerOBJ)
        console.log(">>>>>>>>>createAccount controller Ended>>>>>>>>");

    } catch (error) {
        next(error)
    }
}

const getAccountByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getAccountByID controller Started>>>>>>>>");
        let ID = req.params.id
        let allAccounts = await getAccountByIDService(ID)
        if (!allAccounts) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }
        resp.status(StatusCodes.OK).json(allAccounts)
        console.log(">>>>>>>>>getAccountByID controller Ended>>>>>>>>");
    } catch (error) {
        next(error)
    }
}

const updateAccountByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>updateAccountByID controller Started>>>>>>>>");
        let ID = req.params.id

        const cust = new Account(req.body)

        cust.Validate();
        let updatedAccount = await updateAccountByIDService(cust, ID)

        resp.status(StatusCodes.OK).json({ message: "Account Updated successfully." })
        console.log(">>>>>>>>>updateAccountByID controller Ended>>>>>>>>");
    } catch (error) {
        next(error)
    }
}

const deleteAccountByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>>>>deleteAccountByID controller started >>>>>>>")
        console.log("ID inside delete customer by ID---->", req.params.id)
        let deletedAccount = await deleteAccountByIDService(req.params.id)
        resp.status(StatusCodes.OK).json({ message: "Account deleted successfully." })

        console.log(">>>>>>>>>>>>deleteAccountByID controller Ended >>>>>>>")

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllAccounts,
    createAccount,
    getAccountByID,
    updateAccountByID,
    deleteAccountByID,
    getAllAccounts,
}