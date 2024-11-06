const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authUserMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleware, OrderController.createOrder)
router.get('/get-all-orders/:id', authUserMiddleware, OrderController.getAllOrdersByUserId)
router.get('/get-order-details/:id', authUserMiddleware, OrderController.getOrderDetails)
router.delete('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder)
router.get('/get-all-orders', authMiddleware, OrderController.getAllOrders)

module.exports = router