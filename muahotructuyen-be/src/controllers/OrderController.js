const { response } = require("express");
const OrderSerivce = require("../services/OrderService");
const Order = require("../models/OrderProduct");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      phone,
    } = req.body;
    if (
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderSerivce.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailsAllOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The user ID is requierd",
      });
    }

    const response = await OrderSerivce.getDetailsAllOrder(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The order ID is requierd",
      });
    }

    const response = await OrderSerivce.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const cancleOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The product id is requierd",
      });
    }

    const response = await OrderSerivce.cancleOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const data = await OrderSerivce.getAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Cập nhật trạng thái thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

module.exports = {
  createOrder,
  getDetailsAllOrder,
  getDetailsOrder,
  cancleOrder,
  getAllOrder,
  updateOrderStatus,
};
