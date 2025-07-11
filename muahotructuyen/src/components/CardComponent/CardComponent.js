import React from "react";
import {
  CardStyleWrapper,
  NameProduct,
  ReportTextWrapper,
  PriceTextWrapper,
  DiscountTextWrapper,
  Description,
} from "./CardComponentStyle";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as message from "../MessageComponent/MessageComponent";

const CardComponent = (props) => {
  const {
    id,
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    discount,
    selled,
  } = props;

  const navigate = useNavigate();

  const handleDetailsProduct = () => {
    if (countInStock !== 0) {
      navigate(`/product-detail/${id}`);
    } else {
      message.error("Sản phẩm đã hết hàng !");
    }
  };

  return (
    <CardStyleWrapper
      hoverable
      disable={countInStock === 0}
      onClick={handleDetailsProduct}
      styles={{
        header: { height: "180px", width: "180px", alignItems: "center" },
        body: { padding: "12px" },
      }}
      style={{ width: 195 }}
      cover={
        <img
          style={{ width: 150, height: 150, objectFit: "cover" }}
          alt={name}
          src={image}
        />
      }
    >
      <div className="card-content">
        <div className="card-main">
          <NameProduct title={name}>{name}</NameProduct>
          {description && <Description>{description}</Description>}
          <ReportTextWrapper>
            <span>
              <span>{rating}</span>
              <StarFilled style={{ color: "yellow", fontSize: "15px" }} />
            </span>
            <span>
              {" "}
              |{" "}
              {countInStock === 0
                ? "Hết hàng"
                : `Còn ${countInStock}`}
            </span>
          </ReportTextWrapper>
        </div>

        <PriceTextWrapper>
          <span style={{ marginRight: "8px" }}>
            {price?.toLocaleString()} vnđ
          </span>
          {discount && <DiscountTextWrapper>-{discount}%</DiscountTextWrapper>}
        </PriceTextWrapper>
      </div>
    </CardStyleWrapper>
  );
};

export default CardComponent;
