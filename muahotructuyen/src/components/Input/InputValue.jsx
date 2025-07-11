import React from "react";
import { WrapperInputStyle } from "./InputValueStyle";

const Input = ({ size, placeholder, style, onChange, ...rests }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value); // Chỉ truyền giá trị string ra ngoài
    }
  };

  return (
    <WrapperInputStyle
      size={size}
      placeholder={placeholder}
      style={style}
      {...rests}
      onChange={handleChange}
    />
  );
};

export default Input;