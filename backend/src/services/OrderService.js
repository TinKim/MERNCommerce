const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
// const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, 
            fullName, address, city, phone, user, email, isPaid, paidAt } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    countInStock: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: -order.amount,
                        sold: +order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS',
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id )
            if(newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `The product with the id: ${arrId.join(', ')} is not in stock`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems, 
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone,
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user,
                    isPaid,
                    paidAt,
                })
                if(createdOrder) {
                    // await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrdersByUserId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if(order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if(order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    sold: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: +order.amount,
                        sold: -order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    order = await Order.findByIdAndDelete(id)
                    if(order === null) {
                        resolve({
                            status: 'OK',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if(newData.length) {
                resolve({
                    status: 'ERR',
                    message: `The product with the id${newData.join(',')} does not exist`
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrdersByUserId,
    getOrderDetails,
    cancelOrder,
    getAllOrders
}