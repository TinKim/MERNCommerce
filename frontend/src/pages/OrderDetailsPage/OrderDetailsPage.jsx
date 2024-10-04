import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import {
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
  WrapperTotalPrice,
} from "./style";
import { convertPrice } from "../../utils";
import { orderContant } from "../../contant";
import Loading from "../../components/LoadingComponent/Loading";

const OrderDetailsPage = () => {
  const params = useParams();
  const { id } = params;

  const location = useLocation();
  const { state } = location;

  const fetchOrderDetails = async () => {
    const res = await OrderService.getOrderDetails(state?.token, id);
    return res.data;
  };

  const queryMyOrder = useQuery({
    queryKey: ["order-details"],
    queryFn: fetchOrderDetails,
    enabled: !!id,
  });

  const { isLoading, data } = queryMyOrder;

  const priceDiscountMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * (100 - cur.discount)) / 100) * cur.amount;
    }, 0);
    return result;
  }, [data]);

  // if (isLoading || !data) {
  //   return <Loading isLoading={true} />;
  // }

  return (
    <Loading isLoading={isLoading}>
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "#f5f5f5",
          padding: "2px 0",
        }}
      >
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Chi tiết đơn hàng
          </span>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ: </span>{" "}
                  {`${data?.shippingAddress?.address}, ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>Điện thoại: </span>
                  {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className="delivery-info">
                  <span className="name-delivery">FAST </span>Giao hàng tiết
                  kiệm
                </div>
                <div className="delivery-fee">
                  <span>Phí giao hàng: </span>{" "}
                  {convertPrice(data?.shippingPrice)}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">
                  {orderContant.payment[data?.paymentMethod]}
                </div>
                <div className="status-payment">
                  {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
          <WrapperStyleContent>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "610px" }}>
                <WrapperItemLabel>Sản phẩm</WrapperItemLabel>
              </div>
              <WrapperItemLabel>Đơn giá</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Thành tiền</WrapperItemLabel>
            </div>
            {data?.orderItems?.map((order) => {
              return (
                <WrapperProduct>
                  <WrapperNameProduct>
                    <img
                      src={order?.image}
                      alt={order?.name}
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
                        width: 500,
                        marginLeft: "10px",
                        height: "70px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order?.name}
                      </span>
                    </div>
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.discount || 0}%</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>
                    {convertPrice(
                      ((order?.price * (100 - order?.discount)) / 100) *
                        order?.amount
                    )}
                  </WrapperItem>
                </WrapperProduct>
              );
            })}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginTop: "10px",
              }}
            >
              <WrapperTotalPrice>
                <WrapperItemLabel>Tạm tính</WrapperItemLabel>
                <WrapperItem>{convertPrice(priceDiscountMemo)}</WrapperItem>
              </WrapperTotalPrice>
              <WrapperTotalPrice>
                <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
                <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
              </WrapperTotalPrice>
              <WrapperTotalPrice>
                <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
                <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
              </WrapperTotalPrice>
            </div>
          </WrapperStyleContent>
        </div>
      </div>
    </Loading>
  );
};

export default OrderDetailsPage;
