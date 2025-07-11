import { Col, Row } from "antd";
import { PlusOutlined, MinusOutlined, StarFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  ImageProductStyleWapper,
  ProductNameWrapper,
  WrapperInputNumber,
  WrapperQualityProduct,
  WrapperAddressProduct,
  WrapperPriceProduct,
  WrapperStyleTextSell,
  WrapperPriceTextProduct,
} from "./ProductDetailsComponentStyle";
import ButtonComponent from "./../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import LikeButtonComponent from "./../LikeButtonComponent/LikeButtonComponent";
import ComentComponent from "../ComentComponent/ComentComponent";
import { initFacebookSDK } from "./../../utils";

const ProductDetailsComponent = ({ idProduct }) => {
  const [num, setNum] = useState(1);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => setNum(Number(value));

  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(idProduct);
    return res.data;
  };

  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNum(num + 1);
    } else if (type === "decrease" && num > 1) {
      setNum(num - 1);
    }
  };

  const handleAddOrderProduct = () => {
    if (!user?.id && !user?.name) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          name: productDetails.name,
          amount: num,
          image: productDetails.image,
          price: productDetails.price,
          product: productDetails._id,
        })
      );
    }
  };

  useEffect(() => {
    initFacebookSDK();
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px",
          background: "#fff",
          borderRadius: "4px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col
            span={10}
            style={{
              borderRight: "1px solid #e5e5e5",
              padding: "8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ImageProductStyleWapper
              src={productDetails?.image}
              alt="image product"
              preview={false}
            />
          </Col>
          <Col span={14} style={{ paddingLeft: "16px" }}>
            <ProductNameWrapper>{productDetails?.name}</ProductNameWrapper>
            <div>
              <span style={{ fontSize: "20px", fontWeight: "400", margin: "10px" }}>
                {productDetails?.rating}
              </span>
              <StarFilled style={{ fontSize: "20px", color: "rgb(253, 216, 54)" }} />
              <WrapperStyleTextSell> | Đã bán 1000+ </WrapperStyleTextSell>
            </div>
            <WrapperPriceProduct>
              <WrapperPriceTextProduct>
                {productDetails?.price?.toLocaleString()} vnđ
              </WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <WrapperAddressProduct>
              <span>Giao đến </span>
              <span className="address">{user?.address}</span> -
              <span className="change-address">Đổi địa chỉ</span>
            </WrapperAddressProduct>
            <LikeButtonComponent
              dataHref={"https://developers.facebook.com/docs/plugins/"}
            />
            <div
              style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
            >
              <div style={{ fontWeight: 500 }}>Số lượng</div>
              <WrapperQualityProduct>
                <button onClick={() => handleChangeCount("decrease")}>
                  <MinusOutlined />
                </button>
                <WrapperInputNumber value={num} readOnly />
                <button onClick={() => handleChangeCount("increase")}>
                  <PlusOutlined />
                </button>
              </WrapperQualityProduct>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                }}
                textButton={"Chọn mua"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
                onClick={() => {
                  handleAddOrderProduct();
                  navigate("/order");
                }}
              />
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "#fff",
                  height: "48px",
                  width: "220px",
                  border: "1px solid rgb(13, 92, 182)",
                  borderRadius: "4px",
                }}
                textButton={"Thêm vào giỏ hàng"}
                onClick={handleAddOrderProduct}
                styleTextButton={{ color: "rgb(13, 92, 182)", fontSize: "15px" }}
              />
            </div>
          </Col>
        </Row>
        <ComentComponent
          dataHref={
            "https://developers.facebook.com/docs/plugins/comments#configurator"
          }
          dataWidth={"100%"}
        />
      </div>
    </Loading>
  );
};

export default ProductDetailsComponent;
