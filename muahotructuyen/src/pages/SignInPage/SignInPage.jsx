import React, { useEffect } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./SignInPageStyle";
import imageLogo from "../../assets/Images/logoLogin.png";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputComponent from "../../components/InPutComponent/InPutComponent";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "./../../components/LoadingComponent/Loading";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";
import Input from "../../components/Input/InputValue";

const SignInPage = () => {
  const location = useLocation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const mutation = useMutationHooks((data) => UserService.loginUser(data));

  const { data, isPending, isSuccess } = mutation;
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate({ email, password });
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
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
          {data?.status === "ERR" && (
            <span style={{ color: "red", paddingLeft: "10px" }}>
              {data?.message}
            </span>
          )}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email || !password}
              onClick={handleSignIn}
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
              textButton="Đăng nhập"
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p>
            <WrapperTextLight style={{ margin: "10px" }}>
              Quên mật khẩu ?
            </WrapperTextLight>
          </p>
          <p style={{ margin: "10px" }}>
            Chưa có tài khoản ?
            <WrapperTextLight
              onClick={handleNavigateSignUp}
              style={{ margin: "10px" }}
            >
              Tạo tài khoản
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

export default SignInPage;
