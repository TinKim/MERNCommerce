import { Table } from "antd";
import { Excel } from "antd-table-saveas-excel";
import React, { useMemo, useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
  } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const newComlumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
    setRowSelectedKeys([]);
  };

  const handleExportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newComlumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };

  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: "rgb(255, 57, 69)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <button onClick={handleExportExcel}>Export Excel</button>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
