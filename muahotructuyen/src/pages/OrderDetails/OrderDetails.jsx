import React from "react";
import {
  Card,
  Typography,
  Image,
  Row,
  Col,
  Divider,
  Tag,
  Descriptions,
  Button,
  Space,
} from "antd";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const fetchOrderDetails = async () => {
    const res = await OrderService.getOrderDetails(state?.access_token, id);
    return res.data;
  };
  const queryOrder = useQuery({
    queryKey: ["order-details"],
    queryFn: fetchOrderDetails,
    enabled: !!id && !!state?.access_token,
  });
  const { isLoading, data: order } = queryOrder;
  const mutation = useMutationHooks((data) => {
    const { id, token } = data;
    const res = OrderService.cancleOrder(token, id);
    return res;
  });
  const handelCancle = (id) => {
    mutation.mutate(
      { id, token: state?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  return (
    <Card
      title={<Title level={4}>Chi tiết đơn hàng</Title>}
      bordered={false}
      style={{ maxWidth: 900, margin: "0 auto", background: "#fff" }}
    >
      {/* Trạng thái */}
      <Descriptions
        column={2}
        bordered
        size="middle"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Giao hàng">
          {order?.isDelivered ? (
            <Tag color="green">Đã giao</Tag>
          ) : (
            <Tag color="red">Chưa giao</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Thanh toán">
          {order?.isPaid ? (
            <Tag color="green">Đã thanh toán</Tag>
          ) : (
            <Tag color="red">Chưa thanh toán</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          <Text>{order?.paymentMethod?.toUpperCase()}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          <Text>{new Date(order?.createdAt).toLocaleString()}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Người nhận">
          <Text>{order?.shippingAddress?.fullName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          <Text>{order?.shippingAddress?.phone}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          <Text>{order?.shippingAddress?.address}</Text>
        </Descriptions.Item>
      </Descriptions>

      {/* Danh sách sản phẩm */}
      <Divider orientation="left">Sản phẩm</Divider>
      {order?.orderItems?.map((item, index) => (
        <Row key={index} align="middle" style={{ marginBottom: 12 }}>
          <Col span={4}>
            <Image
              src={item.image}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 4 }}
              preview={false}
            />
          </Col>
          <Col span={12}>
            <Text strong>{item.name}</Text>
            <div>Số lượng: {item.amount}</div>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Text>{(item.price * item.amount).toLocaleString()} VND</Text>
          </Col>
        </Row>
      ))}

      <Divider />

      {/* Tổng tiền */}
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Tạm tính:</Text>
        </Col>
        <Col>
          <Text>{order?.itemsPrice?.toLocaleString()} VND</Text>
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Text strong>Phí vận chuyển:</Text>
        </Col>
        <Col>
          <Text>{order?.shippingPrice?.toLocaleString()} VND</Text>
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Text strong style={{ fontSize: 16, color: "#e74c3c" }}>
            Tổng tiền:
          </Text>
        </Col>
        <Col>
          <Text strong style={{ fontSize: 16 }}>
            {order?.totalPrice?.toLocaleString()} VND
          </Text>
        </Col>
      </Row>

      {/* Nút */}
      <Space>
        <Button
          type="primary"
          danger
          onClick={() => {
            handelCancle(order?._id)
            message.success('Hủy đơn hàng thành công ')
            window.history.back()
          }}
        >
          Hủy đơn hàng
        </Button>
        <Button type="default" onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </Space>
    </Card>
  );
};

export default OrderDetails;
