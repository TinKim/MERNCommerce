import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { WrapperHeader } from "./style";
import { Button, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import { convertPrice } from "../../utils";

const AdminOrder = () => {
  const user = useSelector((state) => state.user);

  const getAllOrders = async () => {
    const res = await OrderService.getAllOrders(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.length - b.fullName.length,
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      filters: [
        {
          text: "Thanh toán tiền mặt khi nhận hàng",
          value: "Thanh toán tiền mặt khi nhận hàng",
        },
        {
          text: "Thanh toán bằng Paypal",
          value: "Thanh toán bằng Paypal",
        },
      ],
      onFilter: (value, record) => {
        if (value === "Thanh toán tiền mặt khi nhận hàng") {
          return record.paymentMethod === "Thanh toán tiền mặt khi nhận hàng";
        }
        return record.paymentMethod === "Thanh toán bằng Paypal";
      },
    },
    {
      title: "Payment Status",
      dataIndex: "isPaid",
      filters: [
        {
          text: "True",
          value: "TRUE",
        },
        {
          text: "False",
          value: "FALSE",
        },
      ],
      onFilter: (value, record) => {
        if (value === "TRUE") {
          return record.isPaid === "TRUE";
        }
        return record.isPaid === "FALSE";
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "isDelivered",
      filters: [
        {
          text: "True",
          value: "TRUE",
        },
        {
          text: "False",
          value: "FALSE",
        },
      ],
      onFilter: (value, record) => {
        if (value === "TRUE") {
          return record.isDelivered === "TRUE";
        }
        return record.isDelivered === "FALSE";
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
  ];
  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        fullName: order?.shippingAddress?.fullName,
        address: order?.shippingAddress?.address,
        phone: order?.shippingAddress?.phone,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ height: 200, width: 200 }}>
        <PieChartComponent data={orders?.data} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
        />
      </div>
    </div>
  );
};

export default AdminOrder;
