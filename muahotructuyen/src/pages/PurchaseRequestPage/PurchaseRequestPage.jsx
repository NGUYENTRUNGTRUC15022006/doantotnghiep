import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import * as message from "../../components/MessageComponent/MessageComponent";
import * as RequestPurchase from "../../services/RequestPurchase";
import { useSelector } from "react-redux";

const PurchaseRequest = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);

  // Đặt giá trị mặc định khi component mount
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        senderName: user.name || "",
        senderEmail: user.email || "",
        senderPhone: user.phone || "",
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      await RequestPurchase.createRequestPurchase(values, user?.access_token);
      message.success("Gửi yêu cầu thành công!");
      form.resetFields();
      form.setFieldsValue({
        senderName: user.name || "",
        senderEmail: user.email || "",
        senderPhone: user.phone?.toString().startsWith("0")
          ? user.phone.toString()
          : "0" + user.phone.toString(),
      });
    } catch (err) {
      message.error("Có lỗi xảy ra khi gửi yêu cầu!");
    }
  };

  return (
    <Form
    autoComplete={false}
      form={form}
      layout="vertical"
      style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}
      onFinish={onFinish}
    >
      <h2>Yêu cầu mua hộ</h2>

      <Form.Item label="Tên người gửi" name="senderName">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Email người gửi" name="senderEmail">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Số điện thoại người gửi" name="senderPhone">
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Tên sản phẩm"
        name="productName"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Đường dẫn sản phẩm (URL)"
        name="productUrl"
        rules={[{ required: true, message: "Vui lòng nhập URL sản phẩm" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Mô tả thêm" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{backgroundColor:"rgb(33, 47, 61)"}}>
          Gửi yêu cầu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PurchaseRequest;
