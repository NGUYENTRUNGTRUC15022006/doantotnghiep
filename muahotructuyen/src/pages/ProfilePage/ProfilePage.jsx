import React, { useEffect } from "react";
import { useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./ProfilePageStyle";
import Input from "../../components/Input/InputValue";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as UserService from "../../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slides/userSlide";
import { Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Cập nhật thành công !",
    });
  };
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Có lỗi xảy ra !",
    });
  };

  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, access_token, rests);
  });
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(
      user?.phone?.toString().startsWith("0")
        ? user.phone.toString()
        : "0" + user.phone?.toString()
    );
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

useEffect(() => {
  const fetchAndUpdateUser = async () => {
    if (isSuccess) {
      success();
      const res = await UserService.getDetailsUser(user?.id, user?.access_token);
      if (res?.data) {
        dispatch(updateUser({ ...res.data, access_token: user?.access_token }));
      }
    } else if (isError) {
      error();
    }
  };
  fetchAndUpdateUser();
}, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangeAdress = (value) => {
    setAddress(value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      access_token: user?.access_token,
      email,
      name,
      phone,
      address,
      avatar,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto", height: "500px",display:'flex',flexDirection:'column',alignItems:'center',minHeight:'772px' }}>
      {contextHolder}
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isLoading={isPending}>
        <WrapperContentProfile>
          {/* Avatar người dùng */}
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Ảnh đại diện</WrapperLabel>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            )}
          </WrapperInput>
          {/* Tên người dùng */}
          <WrapperInput>
            <WrapperLabel htmlFor="name">Tên sử dùng</WrapperLabel>
            <Input
              id="name"
              style={{ width: "300px" }}
              value={name}
              onChange={handleOnchangeName}
              autoComplete="off"
            />
          </WrapperInput>
          {/* Email người dùng */}
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <Input
              id="email"
              style={{ width: "300px" }}
              value={email}
              onChange={handleOnchangeEmail}
              autoComplete="off"
            />
          </WrapperInput>
          {/* Số điện thoại người dùng */}
          <WrapperInput>
            <WrapperLabel htmlFor="phone">Số Điện thoại</WrapperLabel>
            <Input
              id="phone"
              style={{ width: "300px" }}
              value={phone}
              onChange={handleOnchangePhone}
              autoComplete="off"
            />
          </WrapperInput>
          {/* Địa chỉ người dùng */}
          <WrapperInput>
            <WrapperLabel htmlFor="addresss">Địa chỉ</WrapperLabel>
            <Input
              autoComplete="off"
              id="address"
              style={{ width: "300px" }}
              value={address}
              onChange={handleOnchangeAdress}
            />
          </WrapperInput>
              <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "38px",
                width: "88px",
                background: "rgb(33, 47, 61)",
                border: "1px solid #fff",
                borderRadius: "5px",
                padding: "6px",
                lineHeight: "30px",
                margin: "0 auto"
              }}
              textButton={"Cập nhật"}
              styleTextButton={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
              }}
            ></ButtonComponent>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage;
