import React, { useEffect } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./SignUpPageStyle";
import imageLogo from "../../assets/Images/logoLogin.png";
import { Image, message } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputComponent from "../../components/InPutComponent/InPutComponent";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import Input from "../../components/Input/InputValue";

const SignUpPage = () => {
  const navigate = useNavigate();
  const mutation = useMutationHooks((data) => UserService.signUpUser(data));

  const { data, isPending, isSuccess } = mutation;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      messageApi.open({
        type: "success",
        content: "Đăng ký thành công !",
      });
      handleNavigateSignIn();
    }
  }, [isSuccess]);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword });
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        minHeight: "100vh",
      }}
    >
      {contextHolder}
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1 style={{ margin: "10px" }}>Xin chào</h1>
          <p style={{ margin: "10px" }}>Đăng nhập và tạo tài khoản</p>
          <Input
            placeholder="example@gmail.com"
            style={{ margin: "10px", height: "40px" }}
            value={email}
            onChange={handleOnChangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => {
                setIsShowPassword(!isShowPassword);
              }}
              style={{
                zIndex: 10,
                position: "absolute",
                bottom: "18px",
                right: "8px",
                fontSize: "20px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <Input
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              style={{ margin: "10px", height: "40px" }}
              value={password}
              onChange={handleOnChangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => {
                setIsShowConfirmPassword(!isShowConfirmPassword);
              }}
              style={{
                zIndex: 10,
                position: "absolute",
                bottom: "18px",
                right: "8px",
                fontSize: "20px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <Input
              placeholder="confirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              style={{ margin: "10px", height: "40px" }}
              value={confirmPassword}
              onChange={handleOnChangeConfirmPassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red", paddingLeft: "10px" }}>
              {data?.message}
            </span>
          )}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: "rgb(33, 47, 61)",
                height: "45px",
                width: "142px",
                border: "none",
                borderRadius: "4px",
                margin: "10px 10px 10px",
                padding: "10px",
              }}
              textButton="Đăng ký"
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p style={{ margin: "10px" }}>
            Đã có tài khoản ?
            <WrapperTextLight
              onClick={handleNavigateSignIn}
              style={{ margin: "10px" }}
            >
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height={203}
            width={203}
          />
          <h4>Mua sắm tại LinhKienTot</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
