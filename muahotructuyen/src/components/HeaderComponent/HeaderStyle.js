import { Row } from "antd";
import styled from "styled-components";
export const HeaderWrapper = styled(Row)`
  padding: 10px 120px;
  background-color: #212f3d;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 1270px;
  padding: 10px 0;
`;
export const HeaderTextWrapper = styled.span`
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
`;
export const HeaderTextUser = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
`;
export const SearchWrapper = styled.div`
  .ant-input-search-button {
    background-color: #2e86c1;
    border-color: #ffffff;
    &:hover,
    &:focus {
      background-color: rgb(63, 142, 195);
      border-color: #ffffff;
    }
  }
`;
export const HeaderAccountWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
  gap: 10px;
  font-size: 12px;
`;
export const HeaderCartWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 12px;
  position: absolute;
  right: 34px;
`;
export const ContentPopupWrapper = styled.p`
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  &:hover {
    color: rgb(33, 137, 206);
  }
`;
export const PrimaryButtom = styled.button`
  font-size: 16px;
  font-weight: 100;
  border-radius: 5px;
  height: 40px;
  width: 100px;
  background-color: rgb(33, 47, 61);
  color: #fff;
  border: 1px solid white;
  &:hover {
    background-color: rgb(86, 101, 115);
    border-color: #ffffff;
  }
`;
export const ButtonForm = styled.div`
  display: flex;
  gap: 8px;
`;
