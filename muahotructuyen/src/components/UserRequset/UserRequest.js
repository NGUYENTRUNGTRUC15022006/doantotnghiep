import React from "react";
import { Form, Input, Button } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as RequestService from "../../services/RequestPurchase";
import * as message from "../../components/MessageComponent/MessageComponent";
import { WrapperHeader } from "./UserRequestStyle";

const UserRequest = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);

  const createRequestMutation = useMutation({
    mutationFn: (data) =>
      RequestService.createRequestPurchase(data, user?.access_token),
    onSuccess: () => {
      message.success("Gửi yêu cầu thành công!");
      form.resetFields();
    },
    onError: () => {
      message.error("Gửi yêu cầu thất bại!");
    },
  });

  const onFinish = (values) => {
    createRequestMutation.mutate(values);
  };

  return (
    <div>
      <WrapperHeader>Gửi yêu cầu mua hộ</WrapperHeader>
      <div style={{ marginTop: "20px", maxWidth: "600px" }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          disabled={createRequestMutation.isLoading}
        >
          <Form.Item
            label="Tên sản phẩm cần mua"
            name="productName"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Link sản phẩm"
            name="productUrl"
            rules={[
              { required: true, message: "Vui lòng nhập link sản phẩm" },
              { type: "url", message: "Link không hợp lệ" },
            ]}
          >
            <Input placeholder="https://example.com/..." />
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="description"
          >
            <Input.TextArea placeholder="Thêm ghi chú (nếu có)" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createRequestMutation.isLoading}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserRequest;
