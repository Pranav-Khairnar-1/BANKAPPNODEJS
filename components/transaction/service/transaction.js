const Transactions = require("../../../view/transaction")
const db = require('../../../models')
const { customError } = require('../../../error')
const { Op } = require('sequelize');


const getAllTransactions = async (ID, filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllTransactions service started>>>>>>>>");
        let query = {
            where: {
                [Op.or]: [
                    { transferFrom: ID },
                    { transferTo: ID }
                ]
            },
            order: [
                ['createdAt', 'ASC']
            ],

        };
        query = await Transactions.applyFilters(filters, query)
        query.transaction = tran;
        const allTransactionss = await Transactions.getAllTransactionss(query);
        tran.commit();
        const processedTran = allTransactionss.map((u) => {
            let data = {}
            data.transactionID = u.id;
            data.transferFrom = u.transferFrom;

            if (u.transferTo == null) {
                data.transferTo = "self"
                data.closingBalence = u.fromClosingBalance
            } else {
                data.transferTo = u.transferTo
            }

            data.amount = u.amount

            if (u.transferFrom == ID) {
                data.closingBalence = u.fromClosingBalance
            } else if (u.transferTo == ID) {
                data.closingBalence = u.toClosingBalance
            }

            return data

        })
        console.log(">>>>>>>>>getAllTransactionss service ended>>>>>>>>");
        return processedTran
    } catch (error) {
        tran.rollback();
        console.log(error);
        throw (error);
    }
}


const createTransactions = async (transactionOBJ) => {
    const tran = await db.sequelize.transaction();
    let newTransactions = {}
    try {
        console.log(">>>>>>>>>createTransactions service started>>>>>>>>");
        if (transactionOBJ.amount > 0) {
            newTransactions = await transactionOBJ.createCreditTransaction(tran);
        } else {
            let amount = parseInt(transactionOBJ.amount) * (-1)
            const flag = await transactionOBJ.checkDebitEligibility(transactionOBJ.transferFrom, amount, tran);
            console.log("This is what checkDebitEligibility returned ----->", flag);
            if (flag) {
                newTransactions = await transactionOBJ.createDebitTransaction(tran);
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

const createTransferTransactions = async (transactionOBJ) => {
    const tran = await db.sequelize.transaction();
    let newTransactions = {}
    try {
        console.log(">>>>>>>>>createTransferTransactions service started>>>>>>>>");
        let amount = parseInt(transactionOBJ.amount)
        const flag = await transactionOBJ.checkDebitEligibility(transactionOBJ.transferFrom, amount, tran);
        console.log("This is what checkDebitEligibility returned ----->", flag);
        if (flag) {
            newTransactions = await transactionOBJ.createTransferTransaction(tran);
        } else {
            throw new customError("Insufficient Balance")
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
    createTransferTransactions
}