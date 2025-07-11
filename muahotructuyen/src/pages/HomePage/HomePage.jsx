import React, { useEffect, useRef, useState } from "react";
import ProductType from "../../components/ProductType/ProductType";
import {
  ProductTypeWrapper,
  ButtonMoreWapper,
  ProductWapper,
} from "./HomePageStyle";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/Images/slider1.jpg";
import slider2 from "../../assets/Images/slider2.jpg";
import slider3 from "../../assets/Images/slider3.jpg";
import CardComponent from "./../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { Input } from "antd";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 200);
  const [stateProducts, setStateProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(12);
  const [typeProduct, setTypeProduct] = useState([]);
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    setStateProducts(res?.data);
    return res;
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });
  // Xử lý lấy các loại sản phẩm
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProduct(res.data);
    }
    return res;
  };
  useEffect(() => {
    fetchAllTypeProduct();
  },[]);
  // Xử lý filter trên sản phẩm
  const [filterKeyword, setFilterKeyword] = useState("");

  const filteredProducts = stateProducts.filter((p) =>
    p.name.toLowerCase().includes(filterKeyword.toLowerCase())
  );
  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <ProductTypeWrapper>
          {typeProduct.map((item) => {
            return <ProductType name={item} key={item} />;
          })}
        </ProductTypeWrapper>
      </div>
      <div
        className="body"
        style={{
          width: "100%",
          backgroundColor: "#efefef",
        }}
      >
        <div
          id="container"
          style={{
            margin: "0 auto",

            minHeight: "1000px",
            width: "1270px",
          }}
        >
          <SliderComponent arrImage={[slider1, slider2]} />

          <div style={{ padding: "16px 0" }}>
            <Input
              placeholder="Lọc sản phẩm theo tên"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              allowClear
            />
          </div>
          <ProductWapper>
            {filteredProducts?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              );
            })}
          </ProductWapper>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              marginTop: "10px",
              backgroundColor: "rgb(239,239,239)",
            }}
          >
            <ButtonMoreWapper
              textButton={isPreviousData ? "Load more" : "Xem thêm"}
              type="outline"
              styleButton={{
                border: `${
                  products?.total === products?.data?.length
                    ? "1px solid #888"
                    : "1px solid rgb(33, 47, 61)"
                }`,
                color: "#fff",
                width: "240px",
                height: "38px",
                borderRadius: "4px",
                backgroundColor: `${
                  products?.total === products?.data?.length ||
                  products?.totalPage === 1
                    ? "#888"
                    : "rgb(11,116,229)"
                }`,
                cursor: `${
                  products?.total === products?.data?.length ||
                  products?.totalPage === 1
                    ? "not-allowed"
                    : "pointer"
                }`,
              }}
              disabled={
                products?.total === products?.data?.length ||
                products?.totalPage === 1
              }
              styleTextButton={{
                fontWeight: 500,
                color: products?.total === products?.data?.length && "#fff",
              }}
              onClick={() => setLimit((prev) => prev + 6)}
            >
              Xem thêm
            </ButtonMoreWapper>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
