import React from "react";

const ComentComponent = (props) => {
    const {dataHref,dataWidth} = props;
  return (
    <div style={{margin: "-10px -12px 0"}}>
      <div
        class="fb-comments"
        data-href={dataHref}
        data-width={dataWidth}
        data-numposts="5"
      ></div>
    </div>
  );
};

export default ComentComponent;
