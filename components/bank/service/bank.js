const Bank = require("../../../view/bank")
const db = require('../../../models')
const Account = require('../../../models/account')
const Customer = require('../../../models/customer')
// const { customError } = require('../../../error')

const getAllBanks = async (filters) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getAllBanks service started>>>>>>>>");
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
        console.log(">>>>>>>>>getAllBanks service starte22222222>>>>>>>", query);
        query = Bank.applyFilters(filters, query)
        console.log(">>>>>>>>>getAllBanks service starte3333>>>>>>>", query);
        query.transaction = tran;
        const allBanks = await Bank.getAllBanksQP(query);
        tran.commit();
        console.log(">>>>>>>>>getAllBanks service ended>>>>>>>>");
        return allBanks
    } catch (error) {
        tran.tollback();
        console.log(error);
        throw (error);
    }
}

const login = async (queryparams) => {
    const tran = await db.sequelize.transaction()

    try {
        const user = await Bank.verifyLogin(queryparams, tran)
        await tran.commit()

        return user
    } catch (error) {
        console.error(error)
        await tran.rollback()
        throw error
    }
}

const createBank = async (customerOBJ) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>createBank service started>>>>>>>>");
        const newBank = await customerOBJ.createBank(tran);
        tran.commit();
        console.log(">>>>>>>>>createBank service ended>>>>>>>>");
        return newBank;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const getBankByID = async (ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getBankByID service started>>>>>>>>");
        const newBank = await Bank.getBankByID(ID, tran);
        tran.commit();
        console.log(">>>>>>>>>getBankByID service ended>>>>>>>>");
        return newBank;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const updateBankByID = async (BankOBJ, ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>getBankByID service started>>>>>>>>");
        const newBank = await BankOBJ.updateBankByID(BankOBJ, ID, tran);
        tran.commit();
        console.log(">>>>>>>>>getBankByID service ended>>>>>>>>");
        return newBank;
    } catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

const deleteBankByID = async (ID) => {
    const tran = await db.sequelize.transaction();
    try {
        console.log(">>>>>>>>>deleteBankByID service started>>>>>>>>");
        const newBank = await Bank.deleteBankByID(ID, tran);
        tran.commit();
        console.log(">>>>>>>>>deleteBankByID service ended>>>>>>>>");
        return newBank;
    }
    catch (error) {
        console.log(error);
        tran.rollback();
        throw (error)
    }
}

module.exports = {
    // getAllBanks,
    getBankByID,
    createBank,
    updateBankByID,
    deleteBankByID,
    getAllBanks,
    login

}