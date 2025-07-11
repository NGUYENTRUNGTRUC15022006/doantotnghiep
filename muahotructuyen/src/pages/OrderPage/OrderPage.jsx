import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Checkbox,
  InputNumber,
  Button,
  Row,
  Col,
  Divider,
  Form,
} from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  removeOrderProduct,
  setOrderItems,
  updateAmountOrderProduct,
} from "../../redux/slides/orderSlide";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import Loading from "../../components/LoadingComponent/Loading";
import InputValue from "../../components/Input/InputValue";
import { useForm } from "antd/es/form/Form";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(null);
  const priceOptions = [
    { label: "Dưới 200.000 VND", value: "under_200", price: "<200000" },
    {
      label: "Từ 200.000 đến dưới 500.000 VND",
      value: "200_500",
      price: "200000-500000",
    },
    { label: "Trên 500.000 VND", value: "over_500", price: ">500000" },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };
  const handleDeleteSelected = () => {
    selectedRowKeys.forEach((key) => {
      const productId = data.find((item) => item.key === key)?.product;
      if (productId) {
        dispatch(removeOrderProduct({ idProduct: productId }));
      }
    });
    setSelectedRowKeys([]); // Clear selection
  };
  const dispatch = useDispatch();
  const handleDeleteProduct = (productId) => {
    dispatch(removeOrderProduct({ idProduct: productId }));
  };
  const handleChangeQuantity = (type, record) => {
    let newAmount = record.quantity;
    if (type === "increase") {
      newAmount += 1;
    } else if (type === "decrease" && record.quantity > 1) {
      newAmount -= 1;
    }
    dispatch(
      updateAmountOrderProduct({
        idProduct: record.product,
        amount: newAmount,
      })
    );
  };
  const order = useSelector((state) => state.order);
  const columns = [
    {
      title: "Sản phẩm ",
      dataIndex: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.image}
            alt="product"
            style={{ width: 60, marginRight: 10 }}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (_, record) => (
        <div>
          <span style={{ color: "red", marginRight: 8 }}>
            {record.salePrice}
          </span>
          <span style={{ color: "red" }}>{record.originalPrice}vnđ</span>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleChangeQuantity("decrease", record)}
          >
            <MinusOutlined />
          </button>
          <InputNumber
            min={1}
            value={record.quantity}
            readOnly={true}
            size="small"
            style={{ width: "30px" }}
          />
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onClick={() => handleChangeQuantity("increase", record)}
          >
            <PlusOutlined />
          </button>
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Thành tiền</span>
          {selectedRowKeys.length > 1 && (
            <DeleteOutlined
              style={{
                color: "red",
                cursor: "pointer",
                marginLeft: 8,
                position: "relative",
                zIndex: "1",
                right: "-46px",
              }}
              title="Xoá các mục đã chọn"
              onClick={handleDeleteSelected}
            />
          )}
        </div>
      ),
      dataIndex: "total",
      render: (_, record) => (
        <span style={{ color: "red" }}>{record.total} vnđ</span>
      ),
    },
    {
      title: "",
      dataIndex: "delete",
      render: (_, record) => (
        <DeleteOutlined
          style={{ color: "red" }}
          onClick={() => handleDeleteProduct(record.product)}
        />
      ),
    },
  ];

  const data = order.orderItems?.map((item, index) => ({
    key: index.toString(),
    name: item.name,
    image: item.image,
    salePrice: item.price?.toLocaleString(),
    originalPrice: "", // nếu có thể thì thêm gốc ở đây
    quantity: item.amount,
    total: (item.amount * item.price)?.toLocaleString(),
    product: item.product, // ✅ THÊM DÒNG NÀY để biết item nào cần update
  }));
  //Xử lý tiền tạm tính kế bên giỏ hàng
  const selectedItems = useMemo(() => {
    return order.orderItems?.filter((_, index) =>
      selectedRowKeys.includes(index.toString())
    );
  }, [selectedRowKeys, order.orderItems]);

  const subTotal = useMemo(() => {
    if (!selectedItems || selectedItems.length === 0) return 0;
    return selectedItems.reduce(
      (total, item) => total + item.price * item.amount,
      0
    );
  }, [selectedItems]);

  const shippingFee = useMemo(() => {
    if (subTotal > 100000 && subTotal < 50000) {
      return 10000;
    } else if (subTotal > 0 && subTotal < 500000) {
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
    return UserService.updateUser(id, token, rest); // ⚠️ Thứ tự đúng: (id, token, data)
  });

  // ✅ Gọi mutate bên trong function
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
            message.success("Cập nhật thông tin thành công");
            dispatch(updateUser({ ...user, ...stateUserDetails }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const { isLoading, data: dataUpdate } = mutationUpdate;

  const user = useSelector((state) => state.user);
  const handleAddCard = () => {
    if (selectedRowKeys.length === 0) {
      message.error("Vui lòng chọn sản phẩm !");
    } else if (!user?.name || !user?.phone || !user?.address) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment", {
        state: {
          selectedItems: selectedItems,
        },
      });
    }
  };
  const [form] = Form.useForm();
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
      setSateUserDetails({
        name: user?.name || "",
        phone: user.phone?.toString().startsWith("0")
          ? user?.phone.toString()
          : "0" + user?.phone.toString(),
        address: user?.address || "",
      });
    }
  }, [isOpenModalUpdateInfo, user]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };
  return (
    <div style={{ padding: 20, background: "#f7f7f7", minHeight: "732px" }}>
      <div>
        <h3 style={{fontSize:'35px'}}>Giỏ hàng</h3>
        <Row justify="end">
          <Col span={18}>
            <Table
              columns={columns}
              rowSelection={rowSelection}
              dataSource={data}
              pagination={false}
            />
            <Divider />
          </Col>
          <Col span={6}>
            <div
              style={{
                background: "white",
                padding: 20,
                borderRadius: 8,
                margin: "0px 15px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tạm tính</span>
                <span>{subTotal.toLocaleString("vi-VN")} vnđ</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Phí giao hàng</span>
                <span>{shippingFee.toLocaleString("vi-VN")} vnđ</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Giảm giá</span>
                <span>0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Thuế</span>
                <span>0</span>
              </div>
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Tổng tiền</strong>
                <strong style={{ color: "red", fontSize: 20 }}>
                  {totalPrice.toLocaleString("vi-VN")} vnđ
                </strong>
              </div>
              <div style={{ fontSize: 12, textAlign: "right", color: "#888" }}>
                (Đã bao gồm VAT nếu có)
              </div>
              <Button
                type="primary"
                danger
                block
                style={{
                  marginTop: 16,
                  backgroundColor:
                    selectedRowKeys.length > 0 ? "#52c41a" : undefined,
                  borderColor:
                    selectedRowKeys.length > 0 ? "#52c41a" : undefined,
                }}
                onClick={() => handleAddCard()}
              >
                Mua hàng
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
    </div>
  );
};

export default OrderPage;
