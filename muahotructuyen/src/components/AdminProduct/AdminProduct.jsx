import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./AdminProductStyle";
import { Button, Form, Modal, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import InputValue from "./../Input/InputValue";
import { getBase64, renderOptions } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import * as message from "../MessageComponent/MessageComponent";
import Loading from "../LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DraverComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const searchInput = useRef(null);
  const [stateProduct, setSateProduct] = useState({
    name: "",
    image: "",
    type: "",
    price: "",
    countInStock: "",
    rating: "",
    description: "",
  });
  const [stateProductDetails, setSateProductDetails] = useState({
    name: "",
    image: "",
    type: "",
    price: "",
    countInStock: "",
    rating: "",
    description: "",
  });

  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct('',100);
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });
  const { isLoading: isLoadingProduct, data: products } = queryProduct;
  const mutation = useMutationHooks((data) => {
    const res = ProductService.createProduct(data);
    return res;
  });
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thành công");
      handleCancel();
      queryProduct.refetch();
    } else if (isError) {
      message.error("Thất bại");
    }
  }, [isSuccess]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSateProduct({
      name: "",
      image: "",
      type: "",
      price: "",
      countInStock: "",
      rating: "",
      description: "",
    });
    setTypeSelect("");
    formCreate.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateProduct);
  };

  const handleOnChange = (value, name) => {
    setSateProduct({
      ...stateProduct,
      [name]: value,
    });
  };

  const handleOnChangeImage = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setSateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnChangeImageDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setSateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };
  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setSateProductDetails({
        name: res?.data?.name,
        image: res?.data?.image,
        type: res?.data?.type,
        price: res?.data?.price,
        countInStock: res?.data?.countInStock,
        rating: res?.data?.rating,
        description: res?.data?.description,
      });
    }
  };
  const handleOnChangeDetails = (value, name) => {
    setSateProductDetails({
      ...stateProductDetails,
      [name]: value,
    });
  };
  useEffect(() => {
    formUpdate.setFieldsValue(stateProductDetails);
  }, [formUpdate, stateProductDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
    setIsLoadingUpdate(false);
  }, [rowSelected]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
    setIsOpenDrawer(true);
  };

  const rederAction = () => {
    return (
      <div style={{ display: "flex" }}>
        <DeleteOutlined
          style={{
            color: "red",
            fontSize: "20px",
            cursor: "pointer",
            marginRight: "30px",
          }}
          onClick={() => {
            setIsModalOpenDelete(true);
          }}
        />
        <EditOutlined
          style={{
            color: "orange",
            fontSize: "20px",
            cursor: "pointer",
            marginRight: "30px",
          }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputValue
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(value) => setSelectedKeys(value ? [value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      filters: [
        {
          text: "lớn hơn 500.000",
          value: ">=",
        },
        {
          text: "nhỏ hơn 500.000",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record?.price >= 500.0;
        } else if (value === "<=") {
          return record?.price <= 500.0;
        }
      },
      render: (price) => (
        <span style={{ color: "red" , whiteSpace: "nowrap",}}>
          {Number(price).toLocaleString("vi-VN")} vnđ 
        </span>
      ),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      filters: [
        {
          text: "lớn hơn 3 sao",
          value: ">=",
        },
        {
          text: "nhỏ hơn 3 sao",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record?.rating >= 3;
        } else if (value === "<=") {
          return record?.rating <= 3;
        }
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "",
      render: rederAction,
    },
  ];
  const dataTable =
    products?.data.length &&
    products?.data.map((products) => {
      return { ...products, key: products._id };
    });
  // Logic cho update sản phẩm
  const user = useSelector((state) => state?.user);
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });
  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setSateProductDetails({
      name: "",
      image: "",
      type: "",
      price: "",
      countInStock: "",
      rating: "",
      description: "",
    });
    formUpdate.resetFields();
  };
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Thành công");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Thất bại");
    }
  }, [isSuccessUpdated]);
  // Logic chức năng xóa sản phẩm
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const {
    data: dataDeleted,
    isPending: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Thành công");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Thất bại");
    }
  }, [isSuccessDeleted]);
  // Xử lý lấy các loại sản phẩm
  const [typeSelect, setTypeSelect] = useState("");
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res.data;
  };
  const typeProducts = useQuery({
    queryKey: ["types-product"],
    queryFn: fetchAllTypeProduct,
  });
  const { isLoading, data: typeProductsData } = typeProducts;
  const handleOnChangeSelect = (value) => {
    if (value === "add_type") {
      setTypeSelect("add_type");
      setSateProduct((prev) => ({
        ...prev,
        type: "",
      }));
      formCreate.setFieldsValue({ type: "" });
    } else {
      setTypeSelect("");
      setSateProduct((prev) => ({
        ...prev,
        type: value,
      }));
      formCreate.setFieldsValue({ type: value });
    }
  };
  return (
    <div>
      <WrapperHeader>Quản Lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Loading isLoading={isPending}>
          <TableComponent
            columns={columns}
            isLoading={isLoadingProduct}
            data={dataTable}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id);
                },
              };
            }}
          />
        </Loading>
      </div>
      {/* Giao diện tạo sản phẩm */}
      <ModalComponent
        forceReder
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Loading isLoading={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="off"
            form={formCreate}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProduct.name}
                onChange={(value) => handleOnChange(value, "name")}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập loại sản phẩm!",
                },
              ]}
            >
              <Select
                value={
                  typeSelect === "add_type" ? "add_type" : stateProduct.type
                }
                name="type"
                onChange={handleOnChangeSelect}
                options={renderOptions(typeProductsData)}
              />
              {typeSelect === "add_type" && (
                <InputValue
                  value={stateProduct.type}
                  onChange={(value) => handleOnChange(value, "type")}
                  name="type"
                />
              )}
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập số lượng sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProduct.countInStock}
                onChange={(value) => handleOnChange(value, "countInStock")}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá sản phẩm"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập giá sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProduct.price}
                onChange={(value) => handleOnChange(value, "price")}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả "
              name="description"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mô tả sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProduct.description}
                onChange={(value) => handleOnChange(value, "description")}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập đánh giá sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProduct.rating}
                onChange={(value) => handleOnChange(value, "rating")}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Hãy thêm ảnh sản phẩm!",
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnChangeImage}
                maxCount={1}
                fileList={
                  stateProductDetails.image
                    ? [
                        {
                          uid: "-1",
                          name: "image.png",
                          status: "done",
                          url: stateProductDetails.image,
                        },
                      ]
                    : []
                }
              >
                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                      position: "absolute",
                      top: "-15px",
                    }}
                    alt="image"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
              style={{ position: "absolute", right: "130px" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: "0 auto " }}
              >
                Tạo sản phẩm
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      {/* Cửa sổ cập nhật thông tin sản phẩm */}
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="30%"
      >
        <Loading isLoading={isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
            form={formUpdate}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProductDetails.name}
                onChange={(value) => handleOnChangeDetails(value, "name")}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập loại sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProductDetails.type}
                onChange={(value) => handleOnChangeDetails(value, "type")}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập loại số lượng sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProductDetails.countInStock}
                onChange={(value) =>
                  handleOnChangeDetails(value, "countInStock")
                }
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá sản phẩm"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập giá sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProductDetails.price}
                onChange={(value) => handleOnChangeDetails(value, "price")}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả "
              name="description"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mô tả sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProductDetails.description}
                onChange={(value) =>
                  handleOnChangeDetails(value, "description")
                }
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập đánh giá sản phẩm!",
                },
              ]}
            >
              <InputValue
                value={stateProductDetails.rating}
                onChange={(value) => handleOnChangeDetails(value, "rating")}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Hãy thêm ảnh sản phẩm!",
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnChangeImageDetails}
                maxCount={1}
                fileList={
                  stateProductDetails.image
                    ? [
                        {
                          uid: "-1",
                          name: "image.png",
                          status: "done",
                          url: stateProductDetails.image,
                        },
                      ]
                    : []
                }
              >
                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                      position: "absolute",
                      top: "-15px",
                    }}
                    alt="imgage"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
              style={{ position: "absolute", right: "130px" }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: "0 auto " }}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      {/* Phần delete */}
      <ModalComponent
        forceReder
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có xóa sản phẩm này không ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
