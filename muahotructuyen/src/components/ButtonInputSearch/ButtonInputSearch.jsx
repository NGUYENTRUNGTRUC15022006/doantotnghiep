import { Button } from "antd";
import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InPutComponent/InPutComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "#566573",
    colorButton = "#fff",
    onChange,
    value
  } = props;

  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        allowClear= {true}
        style={{
          backgroundColor: backgroundColorInput,
          borderRadius: "5px 0px 0px 5px",
        }}
        onChange={onChange}
        value={value}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundColorButton,
          borderRadius: "0px 5px 5px 0px",
          border: !bordered && "none",
        }}
        icon={<SearchOutlined color={colorButton} style={{ color: "#fff" }} />}
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
      />
    </div>
  );
};

export default ButtonInputSearch;
