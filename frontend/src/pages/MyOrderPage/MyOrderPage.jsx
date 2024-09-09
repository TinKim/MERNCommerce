import React, { useEffect } from "react";
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
import { useMutationHooks } from "../../hooks/useMutationHook";
import { message } from "antd";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const fetchMyAllOrders = async () => {
    const res = await OrderService.getAllOrdersByUserId(
      state?.token,
      state?.id
    );
    return res.data;
  };

  const queryMyOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyAllOrders,
    enabled: !!(state?.id && state?.token),
  });

  const { isLoading, data } = queryMyOrder;

  const handleOrderDetails = (id) => {
    navigate(`/order-details/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { token, id, orderItems } = data;
    const res = OrderService.cancelOrder(token, id, orderItems);
    console.log("res", res.data);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      { token: state?.token, id: order._id, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryMyOrder.refetch();
        },
      }
    );
  };

  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Xóa đơn hàng thành công");
    } else if (isErrorCancel) {
      message.error("Xóa đơn hàng không thành công");
    }
  }, [isSuccessCancel, isErrorCancel, dataCancel]);

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
    <Loading isLoading={isLoading}>
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
                    <span style={{ color: "rgb(255, 66, 78)" }}>
                      Giao hàng:{" "}
                    </span>
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
                    <span style={{ color: "rgb(255, 66, 78)" }}>
                      Tổng tiền:{" "}
                    </span>
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
                      onClick={() => handleCancelOrder(order)}
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
    </Loading>
  );
};

export default MyOrderPage;
