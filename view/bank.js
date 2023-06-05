
const db = require("../models")
// const Bank = require("../models/bank")
class Bank {
    constructor(name, abbrevation, activeUsers, assetWorth) {
        this.name = name
        this.abbrevation = abbrevation
        this.activeUsers = activeUsers
        this.assetWorth = assetWorth
    }

    static applyFilters(filters, query) {
        console.log("this is query inside query--->", query)
        for (let filter of filters) {
            switch (filter.field) {
                case 'name':
                    query.where.name = filter.value;
                    break;
                case 'abbrevation':
                    query.where.abbrevation = filter.value;
                    break;
                case 'activeUsers':
                    query.where.activeUsers = { [Op.gte]: filter.value };
                    break;
                case 'assetWorth':
                    query.where.assetWorth = { [Op.gte]: filter.value };
                    break;
                case 'offset':
                    query.offset = parseInt(filter.value);
                    break;
            }
        }
        return query;
    }

    static async getAllBanks(paramOBJ) {
        try {
            console.log(">>>>>>>>>getAllBanks view started>>>>>>>>");
            let allBank = await db.Bank.findAll(paramOBJ)
            console.log(allBank)
            console.log(">>>>>>>>>getAllBanks view ended>>>>>>>>");
            return allBank
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async createBank(tran) {
        try {
            console.log("createBank view started>>>>>>>>>>>>>>>>>>>>>>")
            let newBank = await db.Bank.create({
                name: this.name,
                abbrevation: this.abbrevation,
                activeUsers: this.activeUsers,
                assetWorth: this.assetWorth
            }, { transaction: tran })
            console.log("createBank view ended>>>>>>>>>>>>>>>>>>>>>>")
            return newBank
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async getBankByID(ID, tran) {
        try {
            console.log("getBankByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Bank = await db.Bank.findAll({
                where: {
                    id: ID
                },
                transaction: tran
            })
            console.log(Bank)
            console.log("getBankByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Bank

        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async updateBankByID(BankOBJ, ID, tran) {
        try {
            console.log("updateBankByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Bank = await db.Bank.update(BankOBJ, {
                where: {
                    id: ID 
                },
                transaction: tran
            });
            console.log(BankOBJ)
            console.log("This is what update returns--->", Bank)
            console.log("updateBankByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Bank

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async deleteBankByID(ID, tran) {
        try {
            console.log("deleteBankByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Bank = await db.Bank.destroy({
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log("This is what Delete  returns--->", Bank)
            console.log("deleteBankByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Bank

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
module.exports = Bank