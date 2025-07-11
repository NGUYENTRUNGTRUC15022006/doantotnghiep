import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
export const ProductTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: flex-start;
  height: 44px;
`;
export const ButtonMoreWapper = styled(ButtonComponent)`
background-color:rgb(33, 47, 61);
margin: 10px;
& :hover {
  color: #fff;
  span {
    color: #fff;
  }
}

width: 100%;
text-align: center;
`;
export const ProductWapper = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;
