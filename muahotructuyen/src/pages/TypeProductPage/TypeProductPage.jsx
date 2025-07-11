import React, { useEffect, useState } from "react";
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Row, Pagination } from "antd";
import { ProductWapper, NavbarWapper } from "./TypeProductPageStyle";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Loading from "./../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "./../../hooks/useDebounce";

const TypeProductPage = () => {
  const SearchProduct = useSelector((state) => state?.product?.search);
  const [allProducts, setAllProducts] = useState([]);
  const searchDebounce = useDebounce(SearchProduct, 200);
  const { state } = useLocation();
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    try {
      const res = await ProductService.getProductType(type, page, limit);
      if (res?.status === "OK") {
        setAllProducts(res?.data);
        setProducts(res?.data);
        setPanigate({ ...panigate, total: res?.totalPage });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);
  //Xử lý pagnigation
  useEffect(() => {
    if (searchDebounce) {
      const filtered = allProducts.filter((pro) =>
        pro?.name?.toLowerCase().includes(searchDebounce.toLowerCase())
      );
      setProducts(filtered);
    } else {
      setProducts(allProducts); // reset lại nếu input rỗng
    }
  }, [searchDebounce, allProducts]);
  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };
  return (
    <Loading isLoading={loading}>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "1270px", margin: "0  auto", height: "100%" }}>
          <Row
            style={{
              flexWrap: "nowrap",
              paddingTop: "10px",
              height: "calc(100% - 20px)",
            }}
          >
            <NavbarWapper span={4}>
              <NavBarComponent />
            </NavbarWapper>
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <ProductWapper>
                {products
                  ?.filter((pdt) => {
                    if (searchDebounce === "") {
                      return pdt;
                    } else if (
                      pdt?.name
                        .toLowerCase()
                        .includes(searchDebounce.toLocaleLowerCase())
                    ) {
                      return pdt;
                    }
                  })
                  .map((product) => {
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
              <Pagination
                onChange={onChange}
                defaultCurrent={panigate.pageCurrent}
                total={panigate?.total}
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  justifyContent: "center",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
