
const db = require("../models")
// const transactions = require("../models/bank")
class Transactions {
    constructor(obj) {
        this.transferFrom = obj.transferFrom
        this.transferTo = obj.transferTo
        this.amount = obj.amount
    }

    static async applyFilters(filters, query) {
        console.log("this is query inside query--->", query)
        for (let filter of filters) {
            switch (filter.field) {
                case 'limit':
                    query.limit = parseInt(filter.value);
                    break;
                case 'offset':
                    query.offset = parseInt(filter.value);
                    break;
            }
        }
        return query;
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
            console.log("Value to find account--->", this.transferFrom);
            const Account = await db.account.findOne({
                where: {
                    id: this.transferFrom
                },
                transaction: tran
            });
            Account.balance = parseInt(Account.balance) + parseInt(this.amount)

            console.log("I found the Account In Transaction------>", Account);

            let flag = await db.account.update({ balance: parseInt(Account.balance) }, {
                where: {
                    id: Account.id
                },
                transaction: tran
            });

            console.log("After update Flag------>", flag);


            let newTransactions = await db.transactions.create({
                transferFrom: this.transferFrom,
                amount: this.amount,
                fromClosingBalance: parseInt(Account.balance)
            }, { transaction: tran });

            const customer = await db.customer.findOne({
                where: {
                    id: Account.customerID
                },
                transaction: tran
            });
            console.log("this is customers new worth  Before --->", customer.netWorth);
            customer.netWorth = parseInt(customer.netWorth) + parseInt(this.amount)
            console.log("this is customers new worth  After --->", customer.netWorth);
            let flag1 = await db.customer.update({ netWorth: parseInt(customer.netWorth) }, {
                where: {
                    id: customer.id
                },
                transaction: tran
            });

            const bank = await db.bank.findOne({
                where: {
                    id: Account.bankID
                },
                transaction: tran
            });
            console.log("this is bank asset worth  Before --->", bank.assetWorth);
            bank.assetWorth = parseInt(bank.assetWorth) + parseInt(this.amount)
            console.log("this is bank asset worth  After --->", bank.assetWorth);
            let flag2 = await db.bank.update({ assetWorth: parseInt(bank.assetWorth) }, {
                where: {
                    id: Account.bankID
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
            console.log("This is the amount recieved by debit eligibility-->", amount);
            const Account = await db.account.findOne({
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log("This is the Acount recieved by debit eligibility-->", Account);
            console.log("checkDebitEligibility view ended>>>>>>>>>>>>>>>>>>>>>>")
            return parseInt(Account.balance) >= parseInt(amount)

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async createDebitTransaction(tran) {
        try {
            console.log("createDebitTransaction view started>>>>>>>>>>>>>>>>>>>>>>")

            const Account = await db.account.findOne({
                where: {
                    id: this.transferFrom
                },
                transaction: tran
            });

            Account.balance = parseInt(Account.balance) + parseInt(this.amount)
            let flag = await db.account.update({ balance: parseInt(Account.balance) }, {
                where: {
                    id: Account.id
                },
                transaction: tran
            });

            let newTransactions = await db.transactions.create({
                transferFrom: this.transferFrom,
                amount: parseInt(this.amount),
                fromClosingBalance: parseInt(Account.balance)
            }, { transaction: tran })

            const customer = await db.customer.findOne({
                where: {
                    id: Account.customerID
                },
                transaction: tran
            });
            customer.netWorth = parseInt(customer.netWorth) + parseInt(this.amount)
            let flag1 = await db.customer.update({ netWorth: parseInt(customer.netWorth) }, {
                where: {
                    id: customer.id
                },
                transaction: tran
            });

            const bank = await db.bank.findOne({
                where: {
                    id: Account.bankID
                },
                transaction: tran
            });
            console.log("this is bank asset worth  Before --->", bank.assetWorth);
            bank.assetWorth = parseInt(bank.assetWorth) + parseInt(this.amount)
            console.log("this is bank asset worth  After --->", bank.assetWorth);
            let flag2 = await db.bank.update({ assetWorth: parseInt(bank.assetWorth) }, {
                where: {
                    id: Account.bankID
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

    async createTransferTransaction(tran) {
        try {
            console.log("createTransferTransaction view started>>>>>>>>>>>>>>>>>>>>>>")

            const Account1 = await db.account.findOne({
                where: {
                    id: this.transferFrom
                },
                transaction: tran
            });

            Account1.balance = parseInt(Account1.balance) - parseInt(this.amount)
            let flag = await db.account.update({ balance: parseInt(Account1.balance) }, {
                where: {
                    id: Account1.id
                },
                transaction: tran
            });

            const customer1 = await db.customer.findOne({
                where: {
                    id: Account1.customerID
                },
                transaction: tran
            });
            customer1.netWorth = parseInt(customer1.netWorth) - parseInt(this.amount)
            let flag1 = await db.customer.update({ netWorth: parseInt(customer1.netWorth) }, {
                where: {
                    id: customer1.id
                },
                transaction: tran
            });

            const bank1 = await db.bank.findOne({
                where: {
                    id: Account1.bankID
                },
                transaction: tran
            });
            console.log("this is bank asset worth  Before --->", bank1.assetWorth);
            bank1.assetWorth = parseInt(bank1.assetWorth) - parseInt(this.amount)
            console.log("this is bank asset worth  After --->", bank1.assetWorth);
            let flag2 = await db.bank.update({ assetWorth: parseInt(bank1.assetWorth) }, {
                where: {
                    id: Account1.bankID
                },
                transaction: tran
            });

            const Account2 = await db.account.findOne({
                where: {
                    id: this.transferTo
                },
                transaction: tran
            });

            Account2.balance = parseInt(Account2.balance) + parseInt(this.amount)
            let flag3 = await db.account.update({ balance: parseInt(Account2.balance) }, {
                where: {
                    id: Account2.id
                },
                transaction: tran
            });

            const customer2 = await db.customer.findOne({
                where: {
                    id: Account2.customerID
                },
                transaction: tran
            });
            customer2.netWorth = parseInt(customer2.netWorth) + parseInt(this.amount)
            let flag4 = await db.customer.update({ netWorth: parseInt(customer2.netWorth) }, {
                where: {
                    id: customer2.id
                },
                transaction: tran
            });

            const bank2 = await db.bank.findOne({
                where: {
                    id: Account2.bankID
                },
                transaction: tran
            });
            console.log("this is bank asset worth  Before --->", bank2.assetWorth);
            bank2.assetWorth = parseInt(bank2.assetWorth) + parseInt(this.amount)
            console.log("this is bank asset worth  After --->", bank2.assetWorth);
            let flag5 = await db.bank.update({ assetWorth: parseInt(bank2.assetWorth) }, {
                where: {
                    id: Account2.bankID
                },
                transaction: tran
            });

            let newTransactions = await db.transactions.create({
                transferFrom: this.transferFrom,
                amount: parseInt(this.amount),
                transferTo: this.transferTo,
                fromClosingBalance: parseInt(Account1.balance),
                toClosingBalance: parseInt(Account2.balance)
            }, { transaction: tran })

            console.log("createTransferTransaction view ended>>>>>>>>>>>>>>>>>>>>>>")
            return newTransactions
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}
module.exports = Transactions