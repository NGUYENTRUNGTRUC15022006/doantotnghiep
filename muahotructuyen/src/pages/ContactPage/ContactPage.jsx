import React from "react";
import { Input, Button, Form, message } from "antd";
import styled from "styled-components";


const ContactWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #0b74e5;
`;

const Info = styled.div`
  margin-bottom: 32px;
  line-height: 1.6;
  font-size: 16px;
  color: #333;
`;

const ContactPage = () => {
  const onFinish = (values) => {
    console.log("Contact Form Values:", values);
    message.success("Gửi liên hệ thành công!");
  };

  return (
    <>
      <ContactWrapper style={{minHeight:'702px'}}>
        <Title>Liên hệ với chúng tôi</Title>

        <Info>
          📍 Địa chỉ: 123 Đường ABC, Quận 1, TP. HCM
          <br />
          📞 Điện thoại: 0123 456 789
          <br />
          ✉️ Email: support@example.com
        </Info>

        <Form layout="vertical" onFinish={onFinish} >
          <Form.Item
            label="Tên của bạn"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input autoComplete="off" placeholder="Nhập tên..." />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input autoComplete="off" placeholder="Nhập email..." />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="message"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung liên hệ..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{backgroundColor:"rgb(33, 47, 61)"}}>
              Gửi liên hệ
            </Button>
          </Form.Item>
        </Form>
      </ContactWrapper>

      {/* Footer */}
     
    </>
  );
};

export default ContactPage;
