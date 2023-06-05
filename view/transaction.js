
const db = require("../models")
// const transactions = require("../models/bank")
class Transactions {
    constructor(transferFrom, transferTo, amount) {
        this.transferFrom = transferFrom
        this.transferTo = transferTo
        this.amount = amount
    }

    static async getAllTransactionss(paramOBJ) {
        try {
            console.log(">>>>>>>>>getAllTransactionss view started>>>>>>>>");
            let allTransactions = await db.transactions.findAll(paramOBJ)
            console.log(allTransactions)
            console.log(">>>>>>>>>getAllTransactionss view ended>>>>>>>>");
            return allTransactions
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async createCreditTransaction(tran) {
        try {
            console.log("createCreditTransaction view started>>>>>>>>>>>>>>>>>>>>>>")
            let newTransactions = await db.transactions.create({
                transferFrom: this.transferFrom,
                transferTo: null,
                amount: this.amount,
            }, { transaction: tran });
            const Account = db.account.findOne({
                where: {
                    id: ID
                },
                transaction: tran
            });
            Account.balance += this.amount
            let flag = await db.account.update(Account, {
                where: {
                    id: Account.id
                },
                transaction: tran
            });
            const customer = db.customer.findOne({
                where: {
                    id: Account.customerID
                },
                transaction: tran
            });
            customer.netWorth += this.amount
            let flag1 = await db.customer.update(customer, {
                where: {
                    id: customer.id
                },
                transaction: tran
            });
            console.log("createCreditTransaction view ended>>>>>>>>>>>>>>>>>>>>>>")
            return newTransactions
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async checkDebitEligibility(ID, amount, tran) {
        try {
            console.log("checkDebitEligibility view started>>>>>>>>>>>>>>>>>>>>>>")
            const Account = db.account.findOne({
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log("checkDebitEligibility view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Account.balance >= amount

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async createDebitTransaction(tran) {
        try {
            console.log("createDebitTransaction view started>>>>>>>>>>>>>>>>>>>>>>")
            let newTransactions = await db.transactions.create({
                transferFrom: this.transferFrom,
                transferTo: null,
                amount: this.amount,
            }, { transaction: tran })
            const Account = db.account.findOne({
                where: {
                    id: ID
                },
                transaction: tran
            });
            Account.balance -= this.amount
            let flag = await db.account.update(Account, {
                where: {
                    id: Account.id
                },
                transaction: tran
            });
            const customer = db.customer.findOne({
                where: {
                    id: Account.customerID
                },
                transaction: tran
            });
            customer.netWorth -= this.amount
            let flag1 = await db.customer.update(customer, {
                where: {
                    id: customer.id
                },
                transaction: tran
            });
            console.log("createDebitTransaction view ended>>>>>>>>>>>>>>>>>>>>>>")
            return newTransactions
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}
module.exports = Transactions