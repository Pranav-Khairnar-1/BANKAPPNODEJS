const { StatusCodes } = require('http-status-codes')
const Bank = require('../../../view/bank')
const {
    getAllBanks: getAllBanksService,
    createBank: createBankService,
    getBankByID: getBankByIDService,
    updateBankByID: updateBankByIDService,
    deleteBankByID: deleteBankByIDService,
    // login: loginService
    // getAllBanks: getAllBanksQparamsService
} = require('../service/bank')





const getAllBanks = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getAllBanks controller Started>>>>>>>>");
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

        let allBanks = await getAllBanksService(filters)
        console.log("Service returned------>", allBanks)

        // if (!allBanks) {
        //     resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
        //     return
        // }
        console.log(">>>>>>>>>getAllBanks controller Ended>>>>>>>>");

        resp.status(StatusCodes.OK).json(allBanks)

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const createBank = async (req, resp) => {
    try {
        console.log(">>>>>>>>>createBank controller Started>>>>>>>>");
        const customer = new Bank(req.body)
        console.log("body of create------>", req.body)
        console.log("this is customer in  create customer----->", customer)
        customer.Validate()
        let customerOBJ = await createBankService(customer)
        resp.status(StatusCodes.OK).json(customerOBJ)
        console.log(">>>>>>>>>createBank controller Ended>>>>>>>>");

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)

    }
}

const getBankByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getBankByID controller Started>>>>>>>>");
        let ID = req.params.id
        let allBanks = await getBankByIDService(ID)
        if (!allBanks) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }
        resp.status(StatusCodes.OK).json(allBanks)
        console.log(">>>>>>>>>getBankByID controller Ended>>>>>>>>");
    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const updateBankByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>updateBankByID controller Started>>>>>>>>");
        let ID = req.params.id

        const cust = new Bank(req.body)

        cust.Validate();
        let updatedBank = await updateBankByIDService(cust, ID)

        resp.status(StatusCodes.OK).json({ message: "Bank Updated successfully." })
        console.log(">>>>>>>>>updateBankByID controller Ended>>>>>>>>");
    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const deleteBankByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>>>>deleteBankByID controller started >>>>>>>")
        console.log("ID inside delete customer by ID---->", req.params.id)
        let deletedBank = await deleteBankByIDService(req.params.id)
        resp.status(StatusCodes.OK).json({ message: "Bank deleted successfully." })

        console.log(">>>>>>>>>>>>deleteBankByID controller Ended >>>>>>>")

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)

    }
}

module.exports = {
    getAllBanks,
    createBank,
    getBankByID,
    updateBankByID,
    deleteBankByID,
    getAllBanks,
    // login
}