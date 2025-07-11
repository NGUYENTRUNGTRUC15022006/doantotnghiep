import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  WrapperContent,
  WrapperLableText,
  CategoryItem,
} from "./NavbarComponentStyle.js";
import * as ProductService from "../../services/ProductService";
import ProductType from "../ProductType/ProductType";
import { Divider } from "antd";

const NavBarComponent = () => {
  const [typeProduct, setTypeProduct] = useState([]);
  const location = useLocation();
  const currentType = location.state; // lấy tên danh mục đang xem

useEffect(() => {
  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllTypeProduct();
      if (res?.status === "OK") {
        // Lọc trùng bằng Set
        const uniqueTypes = [...new Set(res.data.map(item => item.trim()))];
        setTypeProduct(uniqueTypes);
      }
    } catch (error) {
      console.error("Lỗi khi lấy loại sản phẩm:", error);
    }
  };

  fetchAllTypeProduct();
}, []);

  return (
    <div>
      <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
      <Divider></Divider>
      <WrapperContent>
        {typeProduct.length > 0 ? (
          typeProduct.map((name, index) => (
            <CategoryItem
              key={index}
              active={currentType === name.trim()}
            >
              <ProductType name={name.trim()} />
            </CategoryItem>
          ))
        ) : (
          <p>Không có danh mục nào.</p>
        )}
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;
