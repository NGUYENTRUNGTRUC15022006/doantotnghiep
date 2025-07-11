import { Card } from "antd";
import styled from "styled-components";

export const CardStyleWrapper = styled(Card)`
  width: 195px;
  height: 300px;
  padding: 10px;

  display: flex;
  flex-direction: column;

  .ant-card-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  img {
    height: 150px;
    width: 150px;
    object-fit: cover;
    object-position: center;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    min-height: 100%;
  }

  .card-main {
    flex-grow: 1;
  }
`;

export const NameProduct = styled.div`
  color: rgb(56, 56, 61);
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  margin-top: 4px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Description = styled.div`
  color: #666;
  font-size: 12px;
  line-height: 14px;
  margin: 2px 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReportTextWrapper = styled.div`
  font-size: 14px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  margin: 5px 0px;
`;

export const PriceTextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 600;
  margin-top: 6px;
`;

export const DiscountTextWrapper = styled.span`
  color: rgb(255, 66, 78);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;