import styled from "styled-components";

export const WrapperLableText = styled.h4`
  color: rgb(56, 56, 61);
  font-size: 20px;
  font-weight: 500;
`;

export const WrapperTextValue = styled.span`
  color: rgb(56, 56, 61);
  font-size: 12px;
  font-weight: 400;
`;

export const WrapperContent = styled.div`
  display: flex;
  //   align-items: center;
  flex-direction: column;
  gap: 12px;
`;

export const WrapperTextPrice = styled.div`
  padding: 4px;
  color: rgb(56, 56, 61);
  border-radius: 10px;
  background-color: rgb(238, 238, 238);
  width: fit-content;
`;

export const CategoryItem = styled.div`
  padding: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  border: ${({ active }) => (active ? "1px solid #1890ff" : "1px solid transparent")};
  border-radius: 4px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#1890ff" : "inherit")};
  background: ${({ active }) => (active ? "#e6f7ff" : "transparent")};

  &:hover {
    border-color: #1890ff;
  }
`;