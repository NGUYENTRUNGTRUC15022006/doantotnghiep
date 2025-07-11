import axios from "axios";
export const axiosJWT = axios.create();

// Call API tạo refresh_token cho user 

export const refreshToken = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}user/refresh-token`,
    { withCredentials: true }
  );
  return res.data;
};
// Call API đăng nhập cho user
export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}user/sign-in`,
    data
  );
  return res.data;
};
// Call API đăng xuất cho user

export const logoutUser = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}user/log-out`);
  return res.data;
};
// Call API đăng ký cho user

export const signUpUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}user/sign-up`,
    data
  );
  return res.data;
};
// Call API lấy dữ liệu cho một user

export const getDetailsUser = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
// Call API lấy tất cả dữ liệu của user

export const getAllUsers = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/getAll`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
// Call API cập nhật dữ liệu của user

export const updateUser = async (id, access_token , data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}user/update-user/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
// Call API xóa  user

export const deleteUser = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}user/delete-user/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
