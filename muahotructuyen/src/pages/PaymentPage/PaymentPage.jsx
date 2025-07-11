import React, { useEffect, useMemo, useState } from "react";
import { Button, Row, Col, Divider, Form, Input, Radio } from "antd";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputValue from "../../components/Input/InputValue";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";

const PaymentPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  const order = useSelector((state) => state.order);
  const selectedItems = location.state?.selectedItems || [];
  const data = order.orderItems?.map((item, index) => {
    const isSelected = selectedItems.some(
      (selected) => selected.product === item.product
    );
    return {
      key: index.toString(),
      name: item.name,
      image: item.image,
      salePrice: item.price?.toLocaleString(),
      originalPrice: "",
      quantity: item.amount,
      total: (item.amount * item.price)?.toLocaleString(),
      product: item.product,
      itemSelected: isSelected, // ✅
    };
  });
  //Xử lý tiền tạm tính kế bên giỏ hàng
  const subTotal = useMemo(() => {
    if (!selectedItems || selectedItems.length === 0) return 0;
    return selectedItems.reduce(
      (total, item) => total + item.price * item.amount,
      0
    );
  }, [selectedItems]);

  const shippingFee = useMemo(() => {
    if (subTotal > 100000) {
      return 10000;
    } else if (subTotal > 0) {
      return 20000;
    } else {
      return 0;
    }
  }, [subTotal]);

  const discount = 0;
  const tax = 0;
  const totalPrice = subTotal + shippingFee + tax - discount;
  // Xử lý khi nhấn mua hàng
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const handleCancleUpdate = () => {
    setSateUserDetails({
      name: "",
      phone: "",
      address: "",
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rest } = data;
    return UserService.updateUser(id, token, rest);
  });
  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rest } = data;
    return OrderService.createOrder(token, { ...rest });
  });
  const {
    mutate: addOrder,
    isPending: isLoadingAddOrder,
    data: dataAddOrder,
    error: errorAddOrder,
  } = mutationAddOrder;

  const handleUpdateInfoUser = () => {
    const { name, address, phone } = stateUserDetails;
    if (name && address && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(updateUser({ ...user, ...stateUserDetails }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const user = useSelector((state) => state.user);
  const handleAddOrder = () => {
    if (
      user?.access_token &&
      selectedItems?.length > 0 &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.id
    ) {
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: selectedItems,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          paymentMethod: paymentMethod,
          itemsPrice: subTotal,
          shippingPrice: shippingFee,
          totalPrice: totalPrice,
          user: user?.id,
        },
        {
          onSuccess: () => {
            message.success("Thanh toán thành công");
          },
        }
      );
    } else {
      message.error("Vui lòng điền đầy đủ thông tin trước khi thanh toán");
    }
  };
  const navigate = useNavigate();
  const handleCancleOrder = () => {
    navigate("/order");
  };
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const [stateUserDetails, setSateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const handleOnChangeDetails = (value, name) => {
    setSateUserDetails({
      ...stateUserDetails,
      [name]: value,
    });
  };
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      const updatedInfo = {
        name: user?.name || "",
        phone: user.phone?.toString().startsWith("0")
          ? user.phone.toString()
          : "0" + user.phone.toString(),
        address: user?.address || "",
      };

      setSateUserDetails(updatedInfo);
      formModal.setFieldsValue(updatedInfo);
    }
  }, [isOpenModalUpdateInfo, user]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };
  return (
    <div style={{ padding: 20, background: "#f7f7f7", height: "100vh" }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div>
          <h3>Chọn phương thức thanh toán</h3>
          <Row justify="end">
            <Col span={18}>
              <div style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
                <Form
                  form={formModal}
                  layout="vertical"
                  initialValues={{
                    fullName: user?.name || "",
                    phone: user?.phone?.toString().startsWith("0")
                      ? user.phone.toString()
                      : "0" + user.phone?.toString(),
                    address: user?.address || "",
                    paymentMethod: "cod", // default radio
                  }}
                  style={{
                    padding: 24,
                    border: "1px solid #000",
                    borderRadius: "5px",
                  }}
                >
                  <h3 style={{ margin: "10px 0" }}>Phương thức thanh toán</h3>
                  <Form.Item
                    name="paymentMethod"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phương thức thanh toán!",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        value="cod"
                      >
                        Thanh toán khi nhận hàng (COD)
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Divider />

                  <h3>Thông tin giao hàng</h3>
                  <Form.Item label="Tên người nhận">
                    <Input value={user?.name} readOnly />
                  </Form.Item>

                  <Form.Item label="Số điện thoại">
                    <Input
                      value={
                        user?.phone?.toString().startsWith("0")
                          ? user?.phone.toString()
                          : "0" + user?.phone?.toString()
                      }
                      readOnly
                    />
                  </Form.Item>

                  <Form.Item label="Địa chỉ giao hàng">
                    <Input.TextArea value={user?.address} rows={2} readOnly />
                  </Form.Item>
                </Form>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  background: "white",
                  padding: 20,
                  borderRadius: 8,
                  margin: "0px 15px",
                  border: "1px solid #080808",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Địa chỉ giao hàng</strong>
                  <span>
                    {user?.address}
                    <p
                      onClick={handleChangeAddress}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        lineHeight: "6px",
                        position: "relative",
                        right: "-22px",
                      }}
                    >
                      thay đổi
                    </p>
                  </span>
                </div>
                <Divider />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Tạm tính</span>
                  <span>{subTotal.toLocaleString("vi-VN")} vnđ</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Phí giao hàng</span>
                  <span>{shippingFee.toLocaleString("vi-VN")} vnđ</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Giảm giá</span>
                  <span>0</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Thuế</span>
                  <span>0</span>
                </div>
                <Divider />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Tổng tiền</strong>
                  <strong style={{ color: "red", fontSize: 20 }}>
                    {totalPrice.toLocaleString("vi-VN")} vnđ
                  </strong>
                </div>
                <div
                  style={{ fontSize: 12, textAlign: "right", color: "#888" }}
                >
                  (Đã bao gồm VAT nếu có)
                </div>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 16, backgroundColor: "#249c24" }}
                  onClick={() => handleAddOrder()}
                >
                  Thanh toán
                </Button>
                <Button
                  type="primary"
                  danger
                  block
                  style={{ marginTop: 16 }}
                  onClick={() => handleCancleOrder()}
                >
                  Hủy
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <ModalComponent
          forceReder
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancleUpdate}
          onOk={handleUpdateInfoUser}
        >
          {/* <Loading isLoading={isLoadingDeleted}> */}
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // onFinish={onUpdateInfoUser}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên !",
                },
              ]}
            >
              <InputValue
                value={stateUserDetails.name}
                onChange={(value) => handleOnChangeDetails(value, "name")}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập số điện thoại !",
                },
              ]}
            >
              <InputValue
                value={stateUserDetails.phone}
                onChange={(value) => handleOnChangeDetails(value, "phone")}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập địa chỉ !",
                },
              ]}
            >
              <InputValue
                value={stateUserDetails.address}
                onChange={(value) => handleOnChangeDetails(value, "address")}
                name="address"
              />
            </Form.Item>
          </Form>
          {/* </Loading> */}
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default PaymentPage;
