const { StatusCodes } = require('http-status-codes')
const Customer = require('../../../view/customer')
const uuid = require('uuid');
// const {} = require('../../../error')

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
const { validationError, customError, databaseError } = require('../../../error');


const login = async (req, res, next) => {
    console.log("Before try");

    try {
        console.log("Before parsed");

        const { username, password } = req.body
        console.log("Successfully parsed");
        if (!username || !password) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: 'Username and password must be specified' })
            return
        }

        if (typeof username !== "string" || typeof password !== "string") {
            throw new validationError("Username And Password Must Be a String")
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
        if (errr instanceof customError) {
            console.error("error>>>>>>", errr)
            next(errr)
        } else {
            let error = new databaseError(errr.message)
            next(error)
        }
    }
}


const getAllCustomers = async (req, resp, next) => {
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
        if (error instanceof customError) {
            console.error("error>>>>>>", error)
            next(error)
        } else {
            let err = new databaseError(error.message)
            next(err)
        }
    }
}

const createCustomer = async (req, resp, next) => {
    try {
        console.log(">>>>>>>>>createCustomer controller Started>>>>>>>>");
        const customer = new Customer(req.body)
        console.log("body of create------>", req.body)
        console.log("this is customer in  create customer----->", customer)
        let valid = await customer.Validate();
        let customerOBJ = await createCustomerService(customer)
        resp.status(StatusCodes.OK).json(customerOBJ)
        console.log(">>>>>>>>>createCustomer controller Ended>>>>>>>>");

    } catch (error) {
        if (error instanceof customError) {
            console.error("error>>>>>>", error)
            next(error)
        } else {
            let err = new databaseError(error.message)
            next(err)
        }

    }
}

const getCustomerByID = async (req, resp, next) => {
    try {
        console.log(">>>>>>>>>getCustomerByID controller Started>>>>>>>>");
        let ID = req.params.id
        let flag = uuid.validate(ID)
        if (!flag) {
            throw new validationError("Invalid Customer ID.")
        }
        console.log("Value of flag in get customer by UUID------>", flag);
        let allCustomers = await getCustomerByIDService(ID)
        if (!allCustomers) {
            resp.status(StatusCodes.NOT_FOUND).json({ message: "No records Found" })
            return
        }
        resp.status(StatusCodes.OK).json(allCustomers)
        console.log(">>>>>>>>>getCustomerByID controller Ended>>>>>>>>");
    } catch (error) {
        if (error instanceof customError) {
            console.error("error>>>>>>", error)
            next(error)
        } else {
            let err = new databaseError(error.message)
            next(err)
        }
    }
}

const updateCustomerByID = async (req, resp, next) => {
    try {
        console.log(">>>>>>>>>updateCustomerByID controller Started>>>>>>>>");
        let ID = req.params.id

        let flag = uuid.validate(ID)
        if (!flag) {
            throw new validationError("Invalid Customer ID.")
        }

        const cust = new Customer(req.body)

        let valid = await cust.ValidateForUpdate();
        let updatedCustomer = await updateCustomerByIDService(cust, ID)

        resp.status(StatusCodes.OK).json({ message: "Customer Updated successfully." })
        console.log(">>>>>>>>>updateCustomerByID controller Ended>>>>>>>>");
    } catch (error) {
        if (error instanceof customError) {
            console.error("error>>>>>>", error)
            next(error)
        } else {
            let err = new databaseError(error.message)
            next(err)
        }
    }
}

const deleteCustomerByID = async (req, resp, next) => {
    try {
        console.log(">>>>>>>>>>>>deleteCustomerByID controller started >>>>>>>")
        console.log("ID inside delete customer by ID---->", req.params.id)
        let ID = req.params.id

        let flag = uuid.validate(ID)
        if (!flag) {
            throw new validationError("Invalid Customer ID.")
        }
        let deletedCustomer = await deleteCustomerByIDService(req.params.id)
        resp.status(StatusCodes.OK).json({ message: "Customer deleted successfully." })

        console.log(">>>>>>>>>>>>deleteCustomerByID controller Ended >>>>>>>")

    } catch (error) {
        if (error instanceof customError) {
            console.error("error>>>>>>", error)
            next(error)
        } else {
            let err = new databaseError(error.message)
            next(err)
        }

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