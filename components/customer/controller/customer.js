const { StatusCodes } = require('http-status-codes')
const Customer = require('../../../view/customer')
const {
    getAllCustomers: getAllCustomersService,
    createCustomer: createCustomerService,
    getCustomerByID: getCustomerByIDService,
    updateCustomerByID: updateCustomerByIDService,
    deleteCustomerByID: deleteCustomerByIDService,
    login: loginService
    // getAllCustomers: getAllCustomersQparamsService
} = require('../service/customer')
const JwtToken = require('../../../middleware/jwt')
const ValidationError = require('../../../error/validationError')


const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: 'Username and password must be specified' })
            return
        }
        const queryparams = {}
        queryparams.username = username
        queryparams.password = password
        //   queryparams.is_active = true

        const user = await loginService(queryparams)
        console.log(
            'data ======>',
            user.id,
            user.username,
            user.firstName,
            user.isAdmin
        )

        const jwt = new JwtToken(
            user.id,
            user.username,
            user.isAdmin,
        )
        const token = jwt.generateToken()

        res.cookie('authorization', token, {
            httpOnly: false,
            secure: false
        })

        res.status(StatusCodes.OK).json({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            token: token
        })
    } catch (errr) {
        console.error("error>>>>>>", errr)
        next(errr)
    }
}

// const getAllCustomers = async (req, resp) => {
//     try {
//         console.log(">>>>>>>>>getAllCustomers controller Started>>>>>>>>");
//         let allCustomers = await getAllCustomersService()
//         if (!allCustomers) {
//             resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
//             return
//         }
//         resp.status(StatusCodes.OK).json(allCustomers)
//         console.log(">>>>>>>>>getAllCustomers controller Ended>>>>>>>>");
//     } catch (error) {
//         resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
//     }
// }

const getAllCustomers = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getAllCustomers controller Started>>>>>>>>");
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

        let allCustomers = await getAllCustomersService(filters)
        console.log("Service returned------>", allCustomers)

        // if (!allCustomers) {
        //     resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
        //     return
        // }
        console.log(">>>>>>>>>getAllCustomers controller Ended>>>>>>>>");

        resp.status(StatusCodes.OK).json(allCustomers)

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const createCustomer = async (req, resp) => {
    try {
        console.log(">>>>>>>>>createCustomer controller Started>>>>>>>>");
        const customer = new Customer(req.body)
        console.log("body of create------>", req.body)
        console.log("this is customer in  create customer----->", customer)
        customer.Validate()
        let customerOBJ = await createCustomerService(customer)
        resp.status(StatusCodes.OK).json(customerOBJ)
        console.log(">>>>>>>>>createCustomer controller Ended>>>>>>>>");

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)

    }
}

const getCustomerByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>getCustomerByID controller Started>>>>>>>>");
        let ID = req.params.id
        let allCustomers = await getCustomerByIDService(ID)
        if (!allCustomers) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }
        resp.status(StatusCodes.OK).json(allCustomers)
        console.log(">>>>>>>>>getCustomerByID controller Ended>>>>>>>>");
    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const updateCustomerByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>updateCustomerByID controller Started>>>>>>>>");
        let ID = req.params.id

        const cust = new Customer(req.body)

        cust.Validate();
        let updatedCustomer = await updateCustomerByIDService(cust, ID)

        resp.status(StatusCodes.OK).json({ message: "Customer Updated successfully." })
        console.log(">>>>>>>>>updateCustomerByID controller Ended>>>>>>>>");
    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)
    }
}

const deleteCustomerByID = async (req, resp) => {
    try {
        console.log(">>>>>>>>>>>>deleteCustomerByID controller started >>>>>>>")
        console.log("ID inside delete customer by ID---->", req.params.id)
        let deletedCustomer = await deleteCustomerByIDService(req.params.id)
        resp.status(StatusCodes.OK).json({ message: "Customer deleted successfully." })

        console.log(">>>>>>>>>>>>deleteCustomerByID controller Ended >>>>>>>")

    } catch (error) {
        // resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        next(error)

    }
}

module.exports = {
    getAllCustomers,
    createCustomer,
    getCustomerByID,
    updateCustomerByID,
    deleteCustomerByID,
    getAllCustomers,
    login
}