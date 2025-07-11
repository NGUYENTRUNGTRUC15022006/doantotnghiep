import styled from "styled-components";

export const FooterWrapper = styled.footer`
  padding: 16px 24px;
  background-color: rgb(33, 47, 61);
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  border-top: 1px solid #e9ecef;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: block;
    flex-direction: column;
    gap: 8px;

    a {
      color: #ffffff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media (min-width: 768px) {
    .footer-content {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
`;
