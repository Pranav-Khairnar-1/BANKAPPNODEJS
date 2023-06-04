
const db = require("../models")
const Account = require("../models/account")
class Account {
    constructor(bankID, balance, customerID) {
        this.customerID = customerID
        this.bankID = bankID
        this.balance = balance
    }
    static async getAllAccounts(paramOBJ) {
        try {
            console.log(">>>>>>>>>getAllAccounts view started>>>>>>>>");
            let allAccount = await db.Account.findAll(paramOBJ)
            console.log(allAccount)
            console.log(">>>>>>>>>getAllAccounts view ended>>>>>>>>");
            return allAccount
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static applyFilters(filters, query) {
        console.log("this is query inside query--->", query)
        for (let filter of filters) {
            switch (filter.field) {
                case 'customerID':
                    query.where.customerID = filter.value;
                    break;
                case 'bankID':
                    query.where.bankID = filter.value;
                    break;
                case 'ID':
                    query.where.id = filter.value;
                    break;
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
    async createAccount(tran) {
        try {
            console.log("createAccount view started>>>>>>>>>>>>>>>>>>>>>>")
            let newAccount = await db.Account.create({
                customerID: this.customerID,
                bankID: this.bankID,
                balance: this.balance,
            }, { transaction: tran })
            console.log("createAccount view ended>>>>>>>>>>>>>>>>>>>>>>")
            return newAccount
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async getAccountByID(ID, tran) {
        try {
            console.log("getAccountByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Account = await db.Account.findAll({
                where: {
                    id: ID
                },
                transaction: tran
            })
            console.log(Account)
            console.log("getAccountByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Account

        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async updateAccountByID(AccountOBJ, ID, tran) {
        try {
            console.log("updateAccountByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Account = await db.Account.update(AccountOBJ, {
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log(AccountOBJ)
            console.log("This is what update returns--->", Account)
            console.log("updateAccountByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Account

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async deleteAccountByID(ID, tran) {
        try {
            console.log("deleteAccountByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Account = await db.Account.destroy({
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log("This is what Delete  returns--->", Account)
            console.log("deleteAccountByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Account

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
module.exports = Account