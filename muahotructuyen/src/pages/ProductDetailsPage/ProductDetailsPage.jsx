import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "./ProductDetailsPageStyle";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleMouseEnter = (e) => {
    e.target.style.color = "rgb(33, 47, 61)";
    e.target.style.cursor = "pointer";
    e.target.style.textDecoration = "underline";
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = "rgb(33, 47, 61)";
    e.target.style.textDecoration = "none";
  };

  return (
    <div style={styles.page}>
      <h3 style={{padding:"0 0 0 40px"}}>
        <span
          style={{color:'#000'}}
          onClick={() => navigate("/")}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Trang chủ
        </span>{" "}
        - Chi tiết sản phẩm
      </h3>
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
