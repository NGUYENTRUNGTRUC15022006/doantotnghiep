import * as ProductService from "../../services/ProductService";
import React, { useEffect, useState } from "react";
import { Col, Input, Badge, Popover, Button } from "antd";
import {
  HeaderWrapper,
  HeaderTextWrapper,
  HeaderAccountWrapper,
  HeaderCartWrapper,
  HeaderTextUser,
  ContentPopupWrapper,
  PrimaryButtom,
  ButtonForm,
} from "./HeaderStyle";
import {
  UserOutlined,
  ShoppingCartOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser, updateUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { searchProduct } from "../../redux/slides/productSlide";
import { useDebounce } from "./../../hooks/useDebounce";
const { Search } = Input;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [loanding, setLoading] = useState(false);

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };
  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    setIsOpenPopUp(false);
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(resetUser());
    window.location.href = "/";
    setLoading(false);
  };
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "myorder") {
      navigate("/my-all-order");
    } else if (type === "admin") {
      navigate("/system/admin");
    }
    setIsOpenPopUp(false);
  };
  const content = (
    <div>
      <ContentPopupWrapper
        onClick={() => {
          handleClickNavigate("profile");
        }}
      >
        Thông tin người dùng
      </ContentPopupWrapper>
      <ContentPopupWrapper
        onClick={() => {
          handleClickNavigate("myorder");
        }}
      >
        Đơn hàng của tôi
      </ContentPopupWrapper>
      {user?.isAdmin && (
        <ContentPopupWrapper
          onClick={() => {
            handleClickNavigate("admin");
          }}
        >
          Quản lý hệ thống
        </ContentPopupWrapper>
      )}
      <ContentPopupWrapper onClick={handleLogout}>
        Đăng xuất
      </ContentPopupWrapper>
    </div>
  );
  //Xử lý tăng Badge khi nhấn vào chọn mua hàng
  const order = useSelector((state) => state.order);
  const totalItemsInCart = user?.id
    ? order.orderItems?.reduce((total, item) => total + item.amount, 0)
    : 0;
  // Xử lý tìm kiếm
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceSearch = useDebounce(searchValue, 300);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debounceSearch) {
        setSuggestions([]);
        return;
      }
      const res = await ProductService.getAllProduct(debounceSearch);
      setSuggestions(res?.data || []);
    };

    fetchSuggestions();
  }, [debounceSearch]);
  const handleSelectSuggestion = (id) => {
    setSearchValue("");
    setSuggestions([]);
    navigate(`/product-detail/${id}`);
  };
  return (
    <div
      style={{
        width: "100%",
        background: "#212f3d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <HeaderWrapper
        style={{
          justifyContent: "space-between",
        }}
      >
        <Col span={4}>
          <HeaderTextWrapper
            onClick={handleNavigateHome}
            style={{ cursor: "pointer" }}
          >
            LinhKienTot
          </HeaderTextWrapper>
        </Col>
        <Col span={12}>
          <ButtonInputSearch
            placeholder="Tìm kiếm sản phẩm"
            allowClear={true}
            bordered={false}
            enterButton="Tìm kiếm"
            size="large"
            value={searchValue}
            onChange={(e) => {
              if (e && e.target) {
                setSearchValue(e.target.value);
              }
            }}
          />

          {searchValue && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "580px",
                background: "#fff",
                zIndex: 999,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                borderRadius: "0 0 6px 6px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelectSuggestion(item._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                      marginRight: 10,
                    }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </Col>
        <Col
          span={8}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          {user?.avatar ? (
            <img
              key={user?.avatar} // ép React re-render khi avatar thay đổi
              src={user?.avatar}
              alt="avatar"
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                marginLeft: "45px",
              }}
            />
          ) : (
            <UserOutlined style={{ fontSize: "30px", color: "#fff" }} />
          )}
          <Loading isLoading={loanding}>
            {user?.access_token ? (
              <>
                <HeaderAccountWrapper>
                  <div style={{ cursor: "pointer" }}>
                    <Popover
                      onOpenChange={(open) => setIsOpenPopUp(open)}
                      open={isOpenPopUp}
                      placement="bottom"
                      content={content}
                      trigger={"click"}
                    >
                      <HeaderTextUser>
                        {user?.name?.length ? user.name : user?.email}
                      </HeaderTextUser>
                      <div>
                        Tài khoản
                        <span>
                          <CaretDownOutlined />
                        </span>
                      </div>
                    </Popover>
                  </div>
                </HeaderAccountWrapper>
              </>
            ) : (
              <ButtonForm>
                <PrimaryButtom
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  Đăng nhập
                </PrimaryButtom>
                <PrimaryButtom
                  onClick={handleNavigateSignUp}
                  style={{ cursor: "pointer" }}
                >
                  Đăng ký
                </PrimaryButtom>
              </ButtonForm>
            )}
          </Loading>

          <HeaderCartWrapper
            onClick={() => navigate("/order")}
            style={{ cursor: "pointer" }}
          >
            <Badge count={totalItemsInCart} size="small">
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "#ffffff" }}
              />
            </Badge>
            <span style={{ fontWeight: "500", color: "#fff" }}>Giỏ hàng</span>
          </HeaderCartWrapper>
        </Col>
      </HeaderWrapper>
      <div
        style={{
          width: "100%",
          backgroundColor: "#212f3d",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "1255px",
            display: "flex",
            gap: "30px",
            padding: "10px 0",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <span onClick={() => navigate("/")}>Trang chủ</span>
          <span onClick={() => navigate("/contact")}>Liên hệ</span>
          <span onClick={() => navigate("/purchase-request")}>
            Gửi yêu cầu mua hộ
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
