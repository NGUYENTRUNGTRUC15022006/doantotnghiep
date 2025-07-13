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
import * as message from "../MessageComponent/MessageComponent";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const getAllOrders = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };
  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrders });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrderStatus(
        orderId,
        newStatus,
        user?.access_token
      );
      message.success("Cập nhật trạng thái thành công!");
      queryOrder.refetch();
    } catch (error) {
      message.error("Cập nhật thất bại!");
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };
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
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (price) => price?.toLocaleString() + " VND",
    },
    {
      title: "Phương thức thanh toán  ",
      dataIndex: "paymentMethod",
      render: (price) => {
        if (price === "cod") {
          return "Thanh toán khi nhận hàng";
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const statusMap = {
          pending: { text: "Chờ xác nhận", color: "#faad14" }, // vàng
          confirmed: { text: "Đã xác nhận", color: "#1890ff" }, // xanh dương
          shipping: { text: "Đang giao", color: "#faad14" }, // vàng
          delivered: { text: "Đã giao", color: "#52c41a" }, // xanh lá
          cancelled: { text: "Đã huỷ", color: "#f5222d" }, // đỏ
        };

        const item = statusMap[status] || {
          text: "Không xác định",
          color: "#ccc",
        };

        return (
          <span style={{ fontWeight: 600, color: item.color }}>
            {item.text}
          </span>
        );
      },
    },
    {
      title: "Cập nhật trạng thái",
      dataIndex: "status",
      render: (status, record) => {
        const buttonStyle = {
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        };

        return (
          <div style={buttonStyle}>
            {status === "pending" && (
              <Button
                size="small"
                style={{
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => handleUpdateStatus(record._id, "confirmed")}
              >
                Xác nhận
              </Button>
            )}

            {status === "confirmed" && (
              <Button
                size="small"
                style={{
                  backgroundColor: "#faad14",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => handleUpdateStatus(record._id, "shipping")}
              >
                Đang giao
              </Button>
            )}

            {status === "shipping" && (
              <Button
                size="small"
                style={{
                  backgroundColor: "#52c41a",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => handleUpdateStatus(record._id, "delivered")}
              >
                Đã giao
              </Button>
            )}

            {status !== "cancelled" && status !== "delivered" && (
              <Button
                size="small"
                danger
                style={{
                  backgroundColor: "#c4421a",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => handleUpdateStatus(record._id, "cancelled")}
              >
                Huỷ
              </Button>
            )}
          </div>
        );
      },
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
