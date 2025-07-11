import React, { useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./AdminOrderStyle";
import { Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import Loading from "../LoadingComponent/Loading";
import InputComponent from "../InPutComponent/InPutComponent";
import DrawerComponent from "../DrawerComponent/DraverComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const getAllOrders = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };
  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrders });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

const columns = [
  {
    title: "Tên",
    dataIndex: "shippingAddress",
    render: (shippingAddress) => shippingAddress?.fullName,
  },
  {
    title: "Số điện thoại",
    dataIndex: "shippingAddress",
    render: (shippingAddress) => shippingAddress?.phone,
  },
  {
    title: "Địa chỉ",
    dataIndex: "shippingAddress",
    render: (shippingAddress) => shippingAddress?.address,
  },
  {
    title: "Tiền hàng",
    dataIndex: "itemsPrice",
    render: (price) => price?.toLocaleString() + " VND",
  },
  {
    title: "Tiền ship",
    dataIndex: "shippingPrice",
    render: (price) => price?.toLocaleString() + " VND",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    render: (price) => price?.toLocaleString() + " VND",
  },
  {
    title: "Phương thức thanh toán  ",
    dataIndex: "paymentMethod",
    render: (price) => {
      if(price === "cod"){
        return "Thanh toán khi nhận hàng"
      }
    },
  },
  {
    title: "Ngày mua",
    dataIndex: "createdAt",
    render: (createdAt) => new Date(createdAt).toLocaleString(),
  },
];
  const dataTable =
    orders?.data.length &&
    orders?.data.map((userItem) => {
      return { ...userItem, key: userItem._id };
    });
  return (
    <div>
      <WrapperHeader>Quản Lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: "10px" }}></div>
      <div style={{ marginTop: "20px" }}>
        <Loading isLoading={isLoadingOrders}>
          <TableComponent
            columns={columns}
            isLoading={isLoadingOrders}
            data={dataTable}
          />
        </Loading>
      </div>
    </div>
  );
};

export default AdminOrder;
