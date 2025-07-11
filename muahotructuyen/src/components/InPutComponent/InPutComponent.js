import React from "react";
import { WrapperInputStyle } from "./InPutComponentStyle";

const InputComponent = ({size,placeholder,style,onChange,...rests}) => {
  return (
    <WrapperInputStyle
      size={size}
      placeholder={placeholder}
      style={style}
      {...rests}
      onChange={onChange}
    />
  );
};

export default InputComponent;
