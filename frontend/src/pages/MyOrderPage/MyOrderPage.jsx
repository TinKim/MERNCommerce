import React from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeaderItem,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStatus,
} from "./style";
import { useLocation, useNavigate } from "react-router-dom";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.token, state?.id);
    return res.data;
  };

  const queryMyOrder = useQuery({
    queryKey: ["users"],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token),
  });

  const { isLoading, data } = queryMyOrder;

  const handleOrderDetails = (id) => {
    navigate(`/order-details/${id}`);
  };

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem>
          <img
            src={order?.image}
            alt=""
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238)",
              padding: "2px",
            }}
          />
          <div
            style={{
              width: 800,
              fontSize: 14,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginLeft: "10px",
            }}
          >
            {order?.name}
          </div>
          <span
            style={{
              fontSize: "14px",
              color: "#242424",
              marginLeft: "14px",
            }}
          >
            x{order?.amount}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#242424",
              marginLeft: "auto",
            }}
          >
            {convertPrice(order?.price)}
          </span>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    // <Loading>
    <WrapperContainer>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
          Đơn hàng của tôi
        </span>
        <WrapperListOrder>
          {data?.map((order) => (
            <WrapperItemOrder key={order?._id}>
              <WrapperStatus>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Trạng thái
                </span>
                <div>
                  <span style={{ color: "rgb(255, 66, 78)" }}>Giao hàng: </span>
                  {`${order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}`}
                </div>
                <div>
                  <span style={{ color: "rgb(255, 66, 78)" }}>
                    Thanh toán:{" "}
                  </span>
                  {`${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
                </div>
              </WrapperStatus>
              {renderProduct(order?.orderItems)}
              <WrapperFooterItem>
                <div>
                  <span style={{ color: "rgb(255, 66, 78)" }}>Tổng tiền: </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgb(56, 56, 61)",
                      fontWeight: 700,
                    }}
                  >
                    {convertPrice(order?.totalPrice)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", paddingTop: 10 }}>
                  <ButtonComponent
                    size={40}
                    styleButton={{
                      height: "36px",
                      border: "1px solid rgb(11, 116, 229)",
                      borderRadius: "4px",
                    }}
                    textButton={"Hủy đơn hàng"}
                    styleTextButton={{
                      color: "rgb(11, 116, 229)",
                      fontSize: "14px",
                    }}
                  ></ButtonComponent>
                  <ButtonComponent
                    onClick={() => handleOrderDetails(order?._id)}
                    size={40}
                    styleButton={{
                      height: "36px",
                      border: "1px solid rgb(11, 116, 229)",
                      borderRadius: "4px",
                    }}
                    textButton={"Xem chi tiết"}
                    styleTextButton={{
                      color: "rgb(11, 116, 229)",
                      fontSize: "14px",
                    }}
                  ></ButtonComponent>
                </div>
              </WrapperFooterItem>
            </WrapperItemOrder>
          ))}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
    // </Loading>
  );
};

export default MyOrderPage;
