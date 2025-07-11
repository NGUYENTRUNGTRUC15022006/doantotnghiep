import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./SliderComponentStyle";

const SilderComponent = ({ arrImage }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };
  return (
    <WrapperSliderStyle {...settings}>
      {arrImage.map((image,index) => {
        return (
          <Image
          key={index}
            src={image}
            alt="slider"
            preview={false}
            width="100%"
            height="320px"
          />
        );
      })}
    </WrapperSliderStyle>
  );
};

export default SilderComponent;
