
const db = require("../models")
// const Customer = require("../models/customer")
const { validationError } = require('../error/index')
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')
class Customer {
    constructor(obj) {
        this.firstName = obj.firstName
        this.lastName = obj.lastName
        this.email = obj.email
        this.mobile = obj.mobile
        this.username = obj.username
        this.password = obj.password
        this.isAdmin = obj.isAdmin
        this.netWorth = obj.netWorth

    }

    static async getCustomerBaseQueryGET() {
        return db.customer.findAll;
    }

    static async verifyLogin(loginOBJ, tran) {

        const user = await db.customer.findOne({
            where: {
                username: loginOBJ.username
            },
            transaction: tran
        })
        const match = await bcrypt.compare(loginOBJ.password, user.password);
        console.log("THis is the value of User inside Login----->", user);
        if (user == null || user == undefined) {
            throw new validationError("Invalid Username")
        }

        if (match) {
            //login
            return user
        } else {
            throw new validationError('Invalid Username or Password')
        }

    }

    static applyFilters(filters, query) {
        console.log("this is query inside query--->", query)
        for (let filter of filters) {
            switch (filter.field) {
                case 'fname':
                    query.where.firstName = { [Op.substring]: filter.value };
                    break;
                case 'lname':
                    query.where.lastName = { [Op.substring]: filter.value };
                    break;
                case 'email':
                    query.where.email = { [Op.substring]: filter.value };
                    break;
                case 'limit':
                    query.limit = parseInt(filter.value);
                    break;
                case 'offset':
                    query.offset = parseInt(filter.value);
                    break;
                case 'networth':
                    query.where.networth = { [Sequelize.Op.gte]: parseInt(value) };
                    break;
                // case 'username':
                //     query.offset = parseInt(filter.value);
                //     break;

                // Add more cases for additional filter fields
            }
        }
        return query;
    }


    static async getAllCustomers(tran) {
        try {
            console.log(">>>>>>>>>getAllCustomers view started>>>>>>>>");
            let { count, allCustomer } = await db.customer.findAndCountAll({
                transaction: tran
            })
            console.log(allCustomer)
            console.log("asdfdcsdfDFwFWWRGW!!!!!!!!!", count)
            allCustomer.count = count
            console.log(">>>>>>>>>getAllCustomers view ended>>>>>>>>");
            return allCustomer
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async getAllCustomersQP(paramOBJ) {
        try {
            console.log(">>>>>>>>>getAllCustomersQP view started>>>>>>>>");
            let { count, rows } = await db.customer.findAndCountAll(paramOBJ)
            console.log(rows)
            console.log("asdfdcsdfDFwFWWRGW!!!!!!!!!", count)
            // rows.count = count
            const returnOBJ = {
                data: rows,
                count: count
            }
            console.log(">>>>>>>>>getAllCustomersQP view ended>>>>>>>>");
            return returnOBJ
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async createCustomer(tran) {
        try {
            console.log("createCustomer view started>>>>>>>>>>>>>>>>>>>>>>")
            await this.doesUserExists(tran);
            let newCustomer = await db.customer.create({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                mobile: this.mobile,
                username: this.username,
                password: this.password,
                isAdmin: this.isAdmin,
                netWorth: this.netWorth
            }, { transaction: tran })
            console.log("createCustomer view ended>>>>>>>>>>>>>>>>>>>>>>")
            return newCustomer
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    static async getCustomerByID(ID, tran) {
        try {
            console.log("getCustomerByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Customer = await db.customer.findAll({
                where: {
                    id: ID
                },
                transaction: tran
            })
            console.log(Customer)
            if (customers.length < 1) {
                throw new validationError("User Not Found")
            }
            console.log("getCustomerByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Customer

        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async updateCustomerByID(CustomerOBJ, ID, tran) {
        try {
            console.log("updateCustomerByID view started>>>>>>>>>>>>>>>>>>>>>>")
            // let find = await this.getCustomerByID(ID, tran);
            // console.log(find);
            let Customer = await db.customer.update(CustomerOBJ, {
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log(CustomerOBJ)
            console.log("This is what update returns--->", Customer)
            console.log("updateCustomerByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Customer

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async Validate() {
        const emaiRegex = /@/;
        if (this.firstName == "" || this.firstName == null) {
            throw new validationError("Invalid First Name.")
        }
        if (this.lastName == "" || this.lastName == null) {
            throw new validationError("Invalid Las Name.")
        }
        if (this.username == "" || this.username == null) {
            throw new validationError("Invalid User Name.")
        }
        if (this.email == "" || this.email == null || !emaiRegex.test(this.email)) {
            throw new validationError("Invalid Email.")
        }
        if (this.mobile == "" || this.mobile == null || this.mobile.length != 10) {
            throw new validationError("Invalid Mobile Number.")
        }
        if (this.password == "" || this.password == null || this.password.length < 8) {
            throw new validationError("Invalid Password.")
        }
        if (!(typeof this.isAdmin === 'boolean')) {
            throw new validationError("Admin Flag must be a boolean value.")
        }
    }

    async ValidateForUpdate() {
        const emaiRegex = /@/;
        if (this.firstName == "" || this.firstName == null) {
            throw new validationError("Invalid First Name.")
        }
        if (this.lastName == "" || this.lastName == null) {
            throw new validationError("Invalid Las Name.")
        }
        if (!(this.username == undefined || this.username == null)) {
            throw new validationError("User Name Can not be updated!!")
        }
        if (this.email == "" || this.email == null || !emaiRegex.test(this.email)) {
            throw new validationError("Invalid Email.")
        }
        if (this.mobile == "" || this.mobile == null || this.mobile.length != 10) {
            throw new validationError("Invalid Mobile Number.")
        }
        if (!(this.password == null || this.password == undefined)) {
            throw new validationError("Password Can not be Updated!")
        }
        if (!(typeof this.isAdmin === 'boolean')) {
            throw new validationError("Admin Flag must be a boolean value.")
        }
    }

    async doesUserExists(tran) {
        try {
            console.log("does user exist validation start--->", this.username);
            let customers = await db.customer.findAll({
                where: {
                    username: this.username
                },
                transaction: tran
            })
            console.log("customers>>>>>>>>>>>>>>>>>>>>>", customers)
            if (customers.length >= 1) {
                throw new validationError("Username Already Exist.")
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async deleteCustomerByID(ID, tran) {
        try {
            console.log("deleteCustomerByID view started>>>>>>>>>>>>>>>>>>>>>>")
            let Customer = await db.customer.destroy({
                where: {
                    id: ID
                },
                transaction: tran
            });
            console.log("This is what Delete unscoped returns--->", Customer)
            console.log("deleteCustomerByID view ended>>>>>>>>>>>>>>>>>>>>>>")
            return Customer

        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
module.exports = Customer

