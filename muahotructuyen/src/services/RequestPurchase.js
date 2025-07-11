import axios from "axios";

// Gửi yêu cầu mua hộ
export const createRequestPurchase = async (data, token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}request-purchase/create`,
      data,
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Lấy tất cả yêu cầu (admin)
export const getAllRequestPurchase = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}request-purchase/all`,
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Cập nhật trạng thái yêu cầu (admin)
export const updateRequestPurchase = async (id, data, token) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/request-purchase/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Xoá yêu cầu mua hộ (admin)
export const deleteRequestPurchase = async (id, token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}request-purchase/delete/${id}`,
      {
        headers: {
          tokenx: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};