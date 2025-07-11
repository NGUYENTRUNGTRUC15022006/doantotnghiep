import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import * as RequestService from "../../services/RequestPurchase";
import TableComponent from "../TableComponent/TableComponent";
import Loading from "../LoadingComponent/Loading";
import { WrapperHeader } from "./AdminRequestStyle";
import { Button, Popconfirm } from "antd";
import * as message from "../../components/MessageComponent/MessageComponent";

const AdminRequest = () => {
  const user = useSelector((state) => state?.user);

  const getAllRequests = async () => {
    const res = await RequestService.getAllRequestPurchase(user?.access_token);
    return res;
  };

  const queryRequest = useQuery({
    queryKey: ["requests"],
    queryFn: getAllRequests,
    enabled: !!user?.access_token,
  });
  const handleUpdate = async (id, status) => {
  try {
    await RequestService.updateRequestPurchase(id, { status }, user?.access_token);
    message.success(`Cập nhật trạng thái ${status} thành công!`);
    queryRequest.refetch();
  } catch (error) {
    message.error("Cập nhật trạng thái thất bại!");
  }
};


  const { isLoading: isLoadingRequests, data: requests } = queryRequest;
  const handleDelete = async (id) => {
    try {
      await RequestService.deleteRequestPurchase(id, user?.access_token);
      message.success("Xóa yêu cầu thành công!");
      queryRequest.refetch(); // làm mới danh sách
    } catch (error) {
      message.error("Xóa yêu cầu thất bại!");
    }
  };

  const columns = [
    {
      title: "Tên người yêu cầu",
      dataIndex: "senderName",
    },
    {
      title: "Email",
      dataIndex: "senderEmail",
    },
    {
      title: "Số điện thoại",
      dataIndex: "senderPhone",
    },
    {
      title: "Tên sản phẩm cần mua",
      dataIndex: "productName",
    },
    {
      title: "Link sản phẩm",
      dataIndex: "productUrl",
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          Xem sản phẩm
        </a>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
  title: "Trạng thái",
  dataIndex: "status",
  render: (status) => {
    if (status === "approved") return <span style={{ color: "green" }}>Đã duyệt</span>;
    if (status === "rejected") return <span style={{ color: "red" }}>Từ chối</span>;
    return <span style={{ color: "orange" }}>Chờ duyệt</span>;
  },
},
{
  title: "Hành động",
  dataIndex: "_id",
  render: (id, record) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Popconfirm
        title="Bạn có chắc muốn xóa yêu cầu này?"
        onConfirm={() => handleDelete(id)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button type="primary" danger>Xóa</Button>
      </Popconfirm>

      {record.status === "pending" && (
        <>
          <Button
            type="primary"
            onClick={() => handleUpdate(id, "approved")}
          >
            Duyệt
          </Button>
          <Button
            danger
            onClick={() => handleUpdate(id, "rejected")}
          >
            Từ chối
          </Button>
        </>
      )}
    </div>
  ),
},
  ];

  const dataTable =
    requests?.data?.length &&
    requests.data.map((item) => ({ ...item, key: item._id }));

  return (
    <div>
      <WrapperHeader>Quản lý yêu cầu mua hộ</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <Loading isLoading={isLoadingRequests}>
          <TableComponent
            columns={columns}
            isLoading={isLoadingRequests}
            data={dataTable}
          />
        </Loading>
      </div>
    </div>
  );
};

export default AdminRequest;
    