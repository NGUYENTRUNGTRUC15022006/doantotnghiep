import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProductType = ({ name }) => {
  const navigate = useNavigate();

  const handleNavigateType = (type) => {
    const normalizedType = String(type)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu
      .replace(/ /g, "_"); // thay khoảng trắng bằng "_"
    navigate(`/product/${normalizedType}`,{state: type});
  };

  return (
    <div
      style={{ padding: "0 10px", cursor: "pointer" }}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </div>
  );
};

export default ProductType;
