import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import {
  AppstoreOutlined,
  PullRequestOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminRequest from "../../components/AdminRequest/AdminRequest";

const AdminPage = () => {
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
    getItem("Yêu cầu", "requests", <PullRequestOutlined />),
  ];

  const [keySelected, setKeySelected] = useState("");

  const renderPage = (key) =>{
    switch(key){
      case 'user':
        return (
          <AdminUser/>
        )
      case 'product':
        return (
          <AdminProduct/>
        )
      case 'orders':
        return (
          <AdminOrder/>
        )
      case 'requests':
        return (
          <AdminRequest/>
        )
        default:
          return (<AdminUser/>)
    }
  }

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart/>
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{ width: 256 ,
            boxShadow: "1px 1px 2px #ccc",
            minHeight:"100vh",
            maxHeight:"100%",
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{flex: '1',padding:'15px'}}>
        {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
