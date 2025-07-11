import React from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/MessageComponent";
import { ButtonCancle } from "../MyOrderPage/MyOrderPageStyle";
const MyOrder = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(
      user?.access_token,
      user.id
    );
    return res.data;
  };
  const queryOrder = useQuery({
    queryKey: ["users"],
    queryFn: fetchMyOrder,
    enabled: !!user?.id && !!user?.access_token,
  });
  const { isLoading, data } = queryOrder;
  const handleOrderDetails = (id) => {
    navigate(`/orderDetails/${id}`, {
      state: {
        access_token: user.access_token,
      },
    });
  };
  //Xử lý hủy đơn hàng
  const mutation = useMutationHooks((data) => {
    const { id, token } = data;
    const res = OrderService.cancleOrder(token, id);
    return res;
  });
  const handelCancle = (id) => {
    mutation.mutate(
      { id, token: user?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  return (
    <div>
      <div style={{height: '767px',alignItems:'center',display:'flex',flexDirection:'column'}}>
        <h1 style={{}}>Đơn hàng của tôi</h1>
        <div
          style={{
            boxShadow:" rgb(33, 47, 61) 1px 2px 5px",
            border: "2px solid rgb(33, 47, 61)",
            margin: "20px 0",
            padding: 20,
            background: "#f7f7f7",
            height: "100%",
            width: "800px",
            borderRadius: "5px",
          }}
        >
          {data?.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#999" }}
            >
              <h3>Không có đơn hàng nào</h3>
              <p>Bạn chưa đặt đơn hàng nào. Hãy tiếp tục mua sắm!</p>
            </div>
          ) : (
            data?.map((item) => {
              return (
                <div
                  key={item?._id}
                  style={{
                    background: "#fff",
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    marginBottom: 24,
                  }}
                >
                  {/* Trạng thái đơn hàng */}
                  <div>
                    <strong style={{ color: "red" }}>Trạng thái</strong>
                    <div>
                      <span style={{ color: "#e74c3c" }}>
                        Giao hàng:{" "}
                        <span style={{ color: "#000" }}>
                          {item?.isDelivered
                            ? "Đã giao thành công"
                            : "Chưa giao hàng"}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#e74c3c" }}>
                        Thanh toán:{" "}
                        <span style={{ color: "#000" }}>
                          {item?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <Divider />

                  {/* Danh sách sản phẩm trong đơn hàng */}
                  {item?.orderItems?.map((product, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <img
                          src={product?.image}
                          alt={product?.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <span>{product?.name}</span>
                      </div>
                      <div>
                        <span>Đơn giá: {product?.price?.toLocaleString()} VNĐ</span>
                        <div>Số lượng: {product?.amount}</div>
                      </div>
                    </div>
                  ))}

                  <Divider />

                  {/* Tổng tiền */}
                  <div style={{ marginBottom: 12 }}>
                    <strong style={{ color: "#e74c3c" }}>
                      Tổng tiền:{" "}
                      <span style={{ color: "#000", fontSize: 16 }}>
                        {item?.totalPrice?.toLocaleString()} VND
                      </span>
                    </strong>
                  </div>

                  {/* Nút thao tác */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <ButtonCancle
                      style={{
                        padding: "6px 12px",
                        border: "1px solid rgb(216, 50, 44)",
                        backgroundColor: "rgb(216, 50, 44)  ",
                        borderRadius: 4,
                        cursor: "pointer",
                        color: "#fff",
                      }}
                      onClick={() => {
                        handelCancle(item?._id);
                        message.success("Hủy đơn hàng thành công")
                      }}
                    >
                      Hủy đơn hàng
                    </ButtonCancle>
                    <button
                      style={{
                        padding: "6px 12px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => handleOrderDetails(item?._id)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
