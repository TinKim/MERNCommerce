import React from "react";
import {
  Lable,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperItemOrder,
  WrapperItemOrderInfo,
} from "./style";
import Loading from "../../components/LoadingComponent/Loading";
import { convertPrice } from "../../utils";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;

  return (
    <div style={{ background: "#f5f5f5", width: "100%", height: "100vh" }}>
      <Loading isLoading={false}>
        <div
          style={{
            height: "100%",
            width: "1270px",
            margin: "0 auto",
            padding: "2px 0",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Đơn hàng đặt thành công
          </span>
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              justifyContent: "center",
            }}
          >
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức giao hàng</Lable>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderContant.delivery[state?.delivery]}
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức thanh toán</Lable>
                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div
                        style={{
                          width: "500px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img
                          src={order.image}
                          alt=""
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            width: "260px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "50px",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Giá tiền: {convertPrice(order?.price)}
                          </span>
                          {/* <WrapperPriceDiscount>
                              {order?.price}
                          </WrapperPriceDiscount> */}
                        </span>
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Số lượng: {order?.amount}
                          </span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperItemOrderInfo>
              <span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgb(254, 56, 52)",
                    fontWeight: "bold",
                  }}
                >
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                </span>
              </span>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSuccess;
