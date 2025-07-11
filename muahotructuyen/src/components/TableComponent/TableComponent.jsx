import { Divider, Radio, Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/Loading";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isLoading = false,
    columns = [],
  } = props;

  return (
    <Loading isLoading={isLoading}>
      <Table

        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
