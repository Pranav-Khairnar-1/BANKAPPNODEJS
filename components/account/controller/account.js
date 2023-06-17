const { StatusCodes } = require('http-status-codes')
const Account = require('../../../view/account')
const {
    getAllAccounts: getAllAccountsService,
    createAccount: createAccountService,
    getAccountByID: getAccountByIDService,
    deleteAccountByID: deleteAccountByIDService,
    getAllAccountsAdmin: getAllAccountsAdminService
    // login: loginService
    // getAllAccounts: getAllAccountsQparamsService
} = require('../service/account')
// const JwtToken = require('../../../middleware/jwt')
// const  ValidationError  = require('../../../error/validationError')


const getAllAccountsAdmin = async (req, resp, next) => {
    try {
        console.log(">>>>>>>>>getAllAccountsAdmin controller Started>>>>>>>>");
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

        let allCustomers = await getAllAccountsAdminService(filters)
        console.log("Service returned------>", allCustomers)

        console.log(">>>>>>>>>getAllCustomers controller Ended>>>>>>>>");

        resp.status(StatusCodes.OK).json(allCustomers)

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}





const getAllAccounts = async (req, resp, next) => {
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

const createAccount = async (req, resp, next) => {
    try {
        console.log(">>>>>>>>>createAccount controller Started>>>>>>>>");
        const account = new Account(req.body)
        let validate = await account.validate()
        console.log("body of create------>", req.body)
        console.log("this is customer in  create account----->", account)
        let accountOBJ = await createAccountService(account)
        resp.status(StatusCodes.OK).json(accountOBJ)
        console.log(">>>>>>>>>createAccount controller Ended>>>>>>>>");

    } catch (error) {
        next(error)
    }
}

const getAccountByID = async (req, resp, next) => {
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

// const updateAccountByID = async (req, resp, next) => {
//     try {
//         console.log(">>>>>>>>>updateAccountByID controller Started>>>>>>>>");
//         let ID = req.params.id

//         const acc = new Account(req.body)

//         acc.Validate();
//         let updatedAccount = await updateAccountByIDService(cust, ID)

//         resp.status(StatusCodes.OK).json({ message: "Account Updated successfully." })
//         console.log(">>>>>>>>>updateAccountByID controller Ended>>>>>>>>");
//     } catch (error) {
//         next(error)
//     }
// }

const deleteAccountByID = async (req, resp, next) => {
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
    deleteAccountByID,
    getAllAccounts,
    getAllAccountsAdmin
}