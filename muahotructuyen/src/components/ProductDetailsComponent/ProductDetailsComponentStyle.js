import styled from "styled-components";
import { Image, InputNumber } from "antd";

export const ImageProductStyleWapper = styled(Image)`
  display: block;
  margin: 0 auto;
  width: 250px;
  height: 250px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  background: #fff;
`;

export const ProductNameWrapper = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const WrapperQualityProduct = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  button {
    width: 36px;
    height: 36px;
    border: none;
    background: #f7f7f7;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: #e6f7ff;
    }
  }
`;

export const WrapperInputNumber = styled(InputNumber)`
  width: 60px !important;
  height: 36px !important;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;

  .ant-input-number-input {
    text-align: center;
    padding: 0;
    height: 36px;
    line-height: 36px;
  }
`;

export const WrapperAddressProduct = styled.div`
  margin: 12px 0;
  .address {
    font-weight: 500;
  }
  .change-address {
    color: #007bff;
    cursor: pointer;
  }
`;

export const WrapperPriceProduct = styled.div`
  margin: 16px 0;
`;

export const WrapperStyleTextSell = styled.span`
  color: #999;
  margin-left: 8px;
`;

export const WrapperPriceTextProduct = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #d0011b;
`;
