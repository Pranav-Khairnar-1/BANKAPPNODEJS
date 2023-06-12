const Account = require("../../../view/account")
const Transaction = require('../../../view/transaction')

const db = require('../../../models');
const { Op } = require('sequelize');
const bank = require("../../../models/bank");
const customer = require("../../../models/customer");
// const { request } = require("express");
const transactions = require("../../../models/transactions")
// const { customError } = require('../../../error')

const getAllAccounts = async (filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllAccounts service started>>>>>>>>");
        let query = {
            where: {},
            include: [
                { model: db.customer, required: true },
                { model: db.bank, required: true },
            ],
        };
        console.log(">>>>>>>>>getAllAccounts service starte22222222>>>>>>>", query);
        query = Account.applyFilters(filters, query)
        console.log(">>>>>>>>>getAllAccounts service starte3333>>>>>>>", query);
        query.transaction = tran;
        const allAccounts = await Account.getAllAccounts(query);
        tran.commit();
        console.log(">>>>>>>>>getAllAccounts service ended>>>>>>>>");
        return allAccounts
    } catch (error) {
        tran.rollback();
        console.log(error);
        throw (error);
    }
}

const getAllAccountsAdmin = async (filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllAccountsAdmin service started>>>>>>>>");
        let query = {
            where: {},
            include: [
                {
                    model: db.customer,
                    required: true
                },
                {
                    model: db.bank,
                    requred: true
                }
            ]


        };
        console.log(">>>>>>>>>getAllAccountsAdmin service starte22222222>>>>>>>", query);
        query = Account.applyFilters(filters, query)
        console.log(">>>>>>>>>getAllAccountsAdmin service starte3333>>>>>>>", query);
        query.transaction = tran;
        const allCustomers = await Account.getAllAccounts(query);
        tran.commit();
        console.log(">>>>>>>>>getAllAccountsAdmin service ended>>>>>>>>");
        return allCustomers
    } catch (error) {
        tran.rollback();
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

const createAccount = async (accountOBJ) => {
    const tran = await db.sequelize.transaction();

    try {
        console.log(">>>>>>>>>createAccount service started>>>>>>>>");
        const newAccount = await accountOBJ.createAccount(tran); 
        const credTran = new Transaction({
            transferFrom: newAccount.id,
            amount: accountOBJ.balance
        })
        let flag = await credTran.createCreditTransaction(tran);

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
    getAllAccountsAdmin
}