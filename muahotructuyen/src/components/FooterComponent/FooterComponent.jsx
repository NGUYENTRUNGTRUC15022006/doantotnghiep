import React from "react";
import { FooterWrapper } from "../FooterComponent/FooterComponentstyle";

const FooterComponent = () => {
  return (
    <FooterWrapper>
      <div className="footer-content">
        <div>© {new Date().getFullYear()} MyShop. All rights reserved.</div>
        <div>
          <a href="/contact">Liên hệ</a> | <a href="/privacy">Chính sách bảo mật</a>
        </div>
      </div>
    </FooterWrapper>
  );
};

export default FooterComponent;
