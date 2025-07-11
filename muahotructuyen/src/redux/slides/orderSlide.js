import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [
    // {
    //   name: { type: String, required: true },
    //   amount: { type: Number, required: true },
    //   image: { type: String, required: true },
    //   price: { type: Number, required: true },
    //   product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //     required: true,
    //   },
    // },
  ],
  shippingAddress: {
    // fullName: { type: String, required: true },
    // address: { type: String, required: true },
    // city: { type: String, required: true },
    // phone: { type: Number, required: true },
  },
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const orderItem = action.payload; // ✅ đơn giản
      if (!orderItem || !orderItem.product) return;

      const existingItem = state.orderItems.find(
        (item) => item?.product === orderItem.product
      );

      if (existingItem) {
        existingItem.amount += orderItem.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },

    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      state.orderItems = state.orderItems.filter(
        (item) => item?.product !== idProduct
      );
    },
    updateAmountOrderProduct: (state, action) => {
      const { idProduct, amount } = action.payload;
      const item = state.orderItems.find((item) => item?.product === idProduct);
      if (item) {
        item.amount = amount;
      }
    },
    setOrderItems: (state, action) => {
      state.orderItems = action.payload;
    },
  },
});

export const {
  addOrderProduct,
  removeOrderProduct,
  updateAmountOrderProduct,
  setOrderItems,
} = orderSlide.actions;
export default orderSlide.reducer;
