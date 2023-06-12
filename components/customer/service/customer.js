const Customer = require("../../../view/customer")
const db = require('../../../models')
const { customError } = require('../../../error')

const getAllCustomers = async (filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllCustomers service started>>>>>>>>");
        let query = {
            where: {},
            order: [
                ['firstName', 'ASC']
            ],
            include: [
                {
                    model: db.account,
                    include: [{ model: db.bank }]
                }
            ]


        };
        console.log(">>>>>>>>>getAllCustomers service starte22222222>>>>>>>", query);
        query = Customer.applyFilters(filters, query)
        console.log(">>>>>>>>>getAllCustomers service starte3333>>>>>>>", query);
        query.transaction = tran;
        const allCustomers = await Customer.getAllCustomersQP(query);
        tran.commit();
        console.log(">>>>>>>>>getAllCustomers service ended>>>>>>>>");
        return allCustomers
    } catch (error) {
        tran.rollback();
        console.log(error);
        throw (error);
    }
}

const login = async (queryparams) => {
    const tran = await db.sequelize.transaction()

    try {
        const user = await Customer.verifyLogin(queryparams, tran)
        await tran.commit()

        return user
    } catch (error) {
        console.error(error)
        await tran.rollback()
        throw error
    }
}

const createCustomer = async (customerOBJ) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>createCustomer service started>>>>>>>>");
        const newCustomer = await customerOBJ.createCustomer(tran);
        tran.commit();
        console.log(">>>>>>>>>createCustomer service ended>>>>>>>>");
        return newCustomer;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const getCustomerByID = async (ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getCustomerByID service started>>>>>>>>");
        const newCustomer = await Customer.getCustomerByID(ID, tran);
        tran.commit();
        console.log(">>>>>>>>>getCustomerByID service ended>>>>>>>>");
        return newCustomer;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const updateCustomerByID = async (CustomerOBJ, ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>updateCustomerByID service started>>>>>>>>");
        const newCustomer = await CustomerOBJ.updateCustomerByID(CustomerOBJ, ID, tran);
        tran.commit();
        console.log(">>>>>>>>>updateCustomerByID service ended>>>>>>>>");
        return newCustomer;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const deleteCustomerByID = async (ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>deleteCustomerByID service started>>>>>>>>");
        const newCustomer = await Customer.deleteCustomerByID(ID, tran);
        tran.commit();
        console.log(">>>>>>>>>deleteCustomerByID service ended>>>>>>>>");
        return newCustomer;
    }
    catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

module.exports = {
    // getAllCustomers,
    getCustomerByID,
    createCustomer,
    updateCustomerByID,
    deleteCustomerByID,
    getAllCustomers,
    login

}