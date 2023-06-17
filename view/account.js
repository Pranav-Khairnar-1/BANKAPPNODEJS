
const db = require("../models")
const Transaction = require('../view/transaction')
const { Op } = require("sequelize")
const { validationError } = require('../error/index')
const uuid = require('uuid');



// const Account = require("../models/account")
class Account {
    constructor(obj) {
        this.customerID = obj.customerID
        this.bankID = obj.bankID
        this.balance = obj.balance
    }
    static async getAllAccounts(paramOBJ) {
        try {
            console.log(">>>>>>>>>getAllAccounts view started>>>>>>>>");
            let { count, rows } = await db.account.findAndCountAll(paramOBJ)
            let allAccount = {
                data: rows,
                count: count
            }
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

    async validate() {
        if (!(uuid.validate(this.bankID))) {
            throw new validationError("Invalid bank ID.")
        }
        if (!(uuid.validate(this.customerID))) {
            throw new validationError("Invalid Customer ID.")
        }
    }
    async createAccount(tran) {
        try {
            console.log("createAccount view started>>>>>>>>>>>>>>>>>>>>>>")
            await this.doesAccountExists(tran);
            await this.doesCustomerExist(this.customerID, tran)
            await this.doesBankExist(this.bankID, tran)
            let newAccount = await db.account.create({
                customerID: this.customerID,
                bankID: this.bankID,
                balance: 0,
            }, { transaction: tran })

            const bank = await db.bank.findOne({
                where: {
                    id: this.bankID
                },
                transaction: tran
            });
            bank.activeUsers = parseInt(bank.activeUsers) + 1;

            let flag1 = await db.bank.update({ activeUsers: parseInt(bank.activeUsers) }, {
                where: {
                    id: this.bankID
                },
                transaction: tran
            });

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
            let Account = await db.account.findAll({
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

    static async doesCustomerExist(ID, tran) {
        try {
            console.log("doesCustomerExist view started>>>>>>>>>>>>>>>>>>>>>>")
            let Customer = await db.customer.findAll({
                where: {
                    id: ID
                },
                transaction: tran
            })
            console.log(Customer)
            if (customers.length < 1) {
                throw new validationError("Customer Not Found")
            }
            console.log("doesCustomerExist view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Customer

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async doesBankExist(ID, tran) {
        try {
            console.log("doesBankExist view started>>>>>>>>>>>>>>>>>>>>>>")
            let Bank = await db.bank.findAll({
                where: {
                    id: ID
                },
                transaction: tran
            })
            console.log(Bank)
            if (Bank.length < 1) {
                throw new validationError("Bank Not Found")
            }
            console.log("doesBankExist view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Bank

        } catch (error) {
            console.log(error)
            throw error
        }
    }



    static async deleteAccountByID(ID, tran) {
        try {
            console.log("deleteAccountByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let account = await db.account.findOne({
                where: {
                    id: ID
                },
                transaction: tran
            });

            let Account = await db.account.destroy({
                where: {
                    id: ID
                },
                transaction: tran
            });

            let customer = await db.customer.findOne({
                where: {
                    id: account.customerID
                },
                transaction: tran
            });
            customer.netWorth = parseInt(customer.netWorth) - parseInt(account.balance)
            let flag1 = await db.customer.update({ netWorth: parseInt(customer.netWorth) }, {
                where: {
                    id: customer.id
                },
                transaction: tran
            });

            let bank = await db.bank.findOne({
                where: {
                    id: account.bankID
                },
                transaction: tran
            });
            console.log("This is the bank I found while deleting------>", bank);
            bank.assetWorth = parseInt(bank.assetWorth) - parseInt(account.balance);
            bank.activeUsers = parseInt(bank.activeUsers) - 1;
            console.log("This is the bank I found After update------>", bank);
            let flag2 = await db.bank.update({ assetWorth: parseInt(bank.assetWorth), activeUsers: parseInt(bank.activeUsers) }, {
                where: {
                    id: account.bankID
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

    async doesAccountExists(tran) {
        try {
            console.log("does Account exist validation start--->", this.customerID, this.bankID);
            let accounts = await db.account.findAll({
                where: {
                    [Op.and]: [
                        { customerID: this.customerID },
                        { bankID: this.bankID }
                    ]
                },
                transaction: tran
            })
            console.log("accounts>>>>>>>>>>>>>>>>>>>>>", accounts)
            if (accounts.length >= 1) {
                throw new validationError("Bank Account Already Exist.")
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

}
module.exports = Account