const Account = require("../../../view/customer")
const db = require('../../../models');
const bank = require("../../../models/bank");
const Customer = require("../../../models/customer");
// const { customError } = require('../../../error')

const getAllAccounts = async (filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllAccounts service started>>>>>>>>");
        let query = {
            where: {},
            include: [
                { model: Customer, required: true },
                { model: bank, required: true }
            ],
        };
        console.log(">>>>>>>>>getAllAccounts service starte22222222>>>>>>>", query);
        query = Account.applyFilters(filters, query)
        console.log(">>>>>>>>>getAllAccounts service starte3333>>>>>>>", query);
        query.transaction = tran;
        const allAccounts = await Account.getAllAccountsQP(query);
        tran.commit();
        console.log(">>>>>>>>>getAllAccounts service ended>>>>>>>>");
        return allAccounts
    } catch (error) {
        tran.tollback();
        console.log(error);
        throw (error);
    }
}

// const login = async (queryparams) => {
//     const tran = await db.sequelize.transaction()

//     try {
//         const user = await Account.verifyLogin(queryparams, tran)
//         await tran.commit()

//         return user
//     } catch (error) {
//         console.error(error)
//         await tran.rollback()
//         throw error
//     }
// }

const createAccount = async (customerOBJ) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>createAccount service started>>>>>>>>");
        const newAccount = await customerOBJ.createAccount(tran);
        tran.commit();
        console.log(">>>>>>>>>createAccount service ended>>>>>>>>");
        return newAccount;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const getAccountByID = async (ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAccountByID service started>>>>>>>>");
        const newAccount = await Account.getAccountByID(ID, tran);
        tran.commit();
        console.log(">>>>>>>>>getAccountByID service ended>>>>>>>>");
        return newAccount;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const updateAccountByID = async (AccountOBJ, ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAccountByID service started>>>>>>>>");
        const newAccount = await AccountOBJ.updateAccountByID(AccountOBJ, ID, tran);
        tran.commit();
        console.log(">>>>>>>>>getAccountByID service ended>>>>>>>>");
        return newAccount;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const deleteAccountByID = async (ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>deleteAccountByID service started>>>>>>>>");
        const newAccount = await Account.deleteAccountByID(ID, tran);
        tran.commit();
        console.log(">>>>>>>>>deleteAccountByID service ended>>>>>>>>");
        return newAccount;
    }
    catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

module.exports = {
    getAccountByID,
    createAccount,
    updateAccountByID,
    deleteAccountByID,
    getAllAccounts,
}