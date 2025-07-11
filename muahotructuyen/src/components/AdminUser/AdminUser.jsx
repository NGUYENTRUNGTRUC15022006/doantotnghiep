import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./AdminUserStyle";
import { Button, Form, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import Loading from "../LoadingComponent/Loading";
import InputValue from "../Input/InputValue";
import DrawerComponent from "../DrawerComponent/DraverComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../MessageComponent/MessageComponent";
import * as UserService from "../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const searchInput = useRef(null);
  const [stateUser, setSateUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    phone: "",
    address: "",
    avatar: "",
  });
  const [stateUserDetails, setSateUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    phone: "",
    address: "",
    avatar: "",
  });

  // Xử lý hiện dữ liệu tất cả user
  const user = useSelector((state) => state?.user);
  const getAllUsers = async () => {
    const res = await UserService.getAllUsers(user?.access_token);
    return res;
  };
  const queryUser = useQuery({ queryKey: ["user"], queryFn: getAllUsers });
  const { isLoading: isLoadingUser, data: users } = queryUser;
  const dataTable =
    users?.data.length &&
    users?.data.map((userItem) => {
      return { ...userItem, key: userItem._id };
    });
  // Xử lý chức năng cập nhật user
  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(
      rowSelected,
      user?.access_token
    );
    if (res?.data) {
      setSateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        password: res?.data?.password,
        phone: res?.data?.phone?.toString().startsWith("0")
          ? res.data.phone.toString()
          : "0" + res.data.phone.toString(),
        address: res?.data?.address,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
      });
    }
  };
  const handleOnChangeImageDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setSateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };
  const [form] = Form.useForm();
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });
  const {
    data: dataUpdated,
    isPending: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setSateUserDetails({
      name: "",
      email: "",
      password: "",
      isAdmin: false,
      phone: "",
      address: "",
      avatar: "",
    });
    form.resetFields();
  };

  const handleOnChangeDetails = (value, name) => {
    setSateUserDetails({
      ...stateUserDetails,
      [name]: value,
    });
  };
  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Thành công");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Thất bại");
    }
  }, [isSuccessUpdated]);
  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
    setIsLoadingUpdate(false);
  }, [rowSelected]);
  const handleDetailsUser = () => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
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
          onClick={handleDetailsUser}
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
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (phone) =>
        phone?.toString().startsWith("0") ? phone : "0" + phone?.toString(),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "",
      render: rederAction,
    },
  ];

  // Logic chức năng xóa user
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });
  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
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
  return (
    <div>
      <WrapperHeader>Quản Lý người dùng</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        {/* <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button> */}
      </div>
      <div style={{ marginTop: "20px" }}>
        <Loading isLoading={isLoadingUser}>
          <TableComponent
            columns={columns}
            isLoading={isLoadingUser}
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
      {/* Cửa sổ cập nhật thông tin sản phẩm */}
      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="30%"
      >
        <Loading isLoading={isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onUpdateUser}
            autoComplete="off"
            form={form}
          >
            <Form.Item label="Tên người dùng " name="name">
              <InputValue
                value={stateUserDetails.name}
                onChange={(value) => handleOnChangeDetails(value, "name")}
                name="name"
              />
            </Form.Item>
            <Form.Item label="Email " name="email">
              <InputValue
                value={stateUserDetails.type}
                onChange={(value) => handleOnChangeDetails(value, "email")}
                name="email"
              />
            </Form.Item>
            <Form.Item label="Quyền admin" name="isAdmin">
              <InputValue
                value={stateUserDetails.countInStock}
                onChange={(value) => handleOnChangeDetails(value, "isAdmin")}
                name="isAdmin"
              />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <InputValue
                value={stateUserDetails.price}
                onChange={(value) => handleOnChangeDetails(value, "phone")}
                name="phone"
              />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <InputValue
                value={stateUserDetails.description}
                onChange={(value) => handleOnChangeDetails(value, "address")}
                name="address"
              />
            </Form.Item>
            <Form.Item label="Avatar" name="avatar">
              <WrapperUploadFile
                onChange={handleOnChangeImageDetails}
                maxCount={1}
                fileList={
                  stateUserDetails.avatar
                    ? [
                        {
                          uid: "-1",
                          name: "avatar.png",
                          status: "done",
                          url: stateUserDetails.avatar,
                        },
                      ]
                    : []
                }
              >
                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                      position: "absolute",
                      top: "-15px",
                    }}
                    alt="avatar"
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
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có xóa sản phẩm này không ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
