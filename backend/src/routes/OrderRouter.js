const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleware, OrderController.createOrder)
router.get('/get-all-orders/:id', authUserMiddleware, OrderController.getAllOrders)
router.get('/get-order-details/:id', authUserMiddleware, OrderController.getOrderDetails)
router.delete('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder)

module.exports = router