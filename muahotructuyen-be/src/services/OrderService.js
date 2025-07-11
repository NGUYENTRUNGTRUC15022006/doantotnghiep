const Order = require("../models/OrderProduct");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      phone,
      orderItems,
      user,
    } = newOrder;
    try {
      const createOrder = await Order.create({
        orderItems,
        shippingAddress: { fullName, address, phone },
        paymentMethod,
        shippingPrice,
        itemsPrice,
        totalPrice,
        user,
      });
      if (createOrder) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsAllOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({ user: id });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defind",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderid = await Order.findById({ _id: id });
      if (orderid === null) {
        resolve({
          status: "ERR",
          message: "The order is not defind",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: orderid,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const cancleOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });
      if (checkOrder === null) {
        resolve({
          status: "OK",
          message: "The order is not defind",
        });
      }
      await Order.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "cancle order success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createOrder,
  getDetailsAllOrder,
  getDetailsOrder,
  cancleOrder,
  getAllOrder
};
