
const db = require("../models")
// const Bank = require("../models/bank")
const { validationError } = require('../error/index')
const { Op } = require("sequelize")

class Bank {
    constructor(obj) {
        this.name = obj.name
        this.abbrevation = obj.abbrevation
        this.activeUsers = obj.activeUsers
        this.assetWorth = obj.assetWorth
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

    async Validate() {
        if (this.name === "" || this.name == null) {
            throw new validationError("Invalid  Name.")
        }
        if (this.abbrevation === "" || this.abbrevation == null) {
            throw new validationError("Invalid Abbrevation")
        }
        if (!(typeof this.activeUsers === 'number')) {
            throw new validationError("Invalid Input For Active users.")
        }
        if (!(typeof this.assetWorth === 'number')) {
            throw new validationError("Invalid Input For asset worth.")
        }

    }

    static async getAllBanks(paramOBJ) {
        try {
            console.log(">>>>>>>>>getAllBanks view started>>>>>>>>");
            let { count, rows } = await db.bank.findAndCountAll(paramOBJ)
            let allBank = {
                data: rows,
                count: count
            }
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
            let flag = await this.doesBankExists();
            console.log(flag);
            let newBank = await db.bank.create({
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
            let Bank = await db.bank.findAll({
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
            let Bank = await db.bank.update(BankOBJ, {
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

    static async deleteBankByID(ID, tran) {
        try {
            console.log("deleteBankByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Bank = await db.bank.destroy({
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


    async doesBankExists(tran) {
        try {
            console.log("does Bank exist validation start--->", this.name, this.abbrevation);
            let banks = await db.bank.findAll({
                where: {
                    [Op.or]: [
                        { name: this.name },
                        { abbrevation: this.abbrevation }
                    ]
                },
                transaction: tran
            })
            console.log("banks>>>>>>>>>>>>>>>>>>>>>", banks)
            if (banks.length >= 1) {
                throw new validationError("Bank Already Exist.")
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
module.exports = Bank