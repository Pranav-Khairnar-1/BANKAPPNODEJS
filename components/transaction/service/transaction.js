const Transactions = require("../../../view/transaction")
const db = require('../../../models')
const Account = require('../../../models/account')
const Customer = require('../../../models/customer')
const { customError } = require('../../../error')

const getAllTransactions = async (filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllTransactions service started>>>>>>>>");
        let query = {
            where: {},
            include: [
                {
                    model: Account,
                    include: [
                        { model: Customer, required: true },
                    ],
                    required: true
                },
            ]
        };
        console.log(">>>>>>>>>getAllTransactions service starte22222222>>>>>>>", query);
        query = Transactions.applyFilters(filters, query)
        console.log(">>>>>>>>>getAllTransactionss service starte3333>>>>>>>", query);
        query.transaction = tran;
        const allTransactionss = await Transactions.getAllTransactionss(query);
        tran.commit();
        console.log(">>>>>>>>>getAllTransactionss service ended>>>>>>>>");
        return allTransactionss
    } catch (error) {
        tran.tollback();
        console.log(error);
        throw (error);
    }
}


const createTransactions = async (transactionOBJ) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>createTransactions service started>>>>>>>>");
        if (transactionOBJ.amount > 0) {
            const newTransactions = await transactionOBJ.createCreditTransaction(tran);
        } else {
            const flag = await transactionOBJ.checkDebitEligibility(transactionOBJ.transferFrom, transactionOBJ.amount, tran);
            if (flag) {
                const newTransactions = await transactionOBJ.createDebitTransaction(tran);
            } else {
                throw new customError("Insufficient Balance")
            }
        }
        tran.commit();
        console.log(">>>>>>>>>createTransactions service ended>>>>>>>>");
        return newTransactions;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}



module.exports = {
    createTransactions,
    getAllTransactions,
}