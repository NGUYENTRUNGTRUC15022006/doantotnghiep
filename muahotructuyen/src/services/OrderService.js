import axios from "axios";
import { axiosJWT } from "./UserService";

export const createOrder = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const getOrderByUserId = async (access_token, id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}order/get-details-all/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const getOrderDetails = async (access_token, id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}order/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const cancleOrder = async ( access_token,id) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}order/cancle-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const getAllOrder = async ( access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}order/get-all-order`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
