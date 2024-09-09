import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
  padding: 18px;
  background-color: #fff;
  border-radius: 8px;
`;

export const WrapperInfoUser = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const WrapperLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  justify-content: center;
`;

export const WrapperContentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .name-info {
    font-weight: bold;
    font-size: 16px;
  }

  .address-info,
  .phone-info,
  .delivery-info,
  .delivery-fee,
  .payment-info,
  .status-payment {
    font-size: 14px;
    color: #666;
  }

  .name-delivery {
    color: rgb(234, 133, 0);
    font-weight: bold;
  }
`;

export const WrapperStyleContent = styled.div`
  margin-top: 12px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

export const WrapperItemLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  width: 610px;

  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border: 1px solid #eee;
    padding: 2px;
    border-radius: 4px;
  }

  div {
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
`;

export const WrapperItem = styled.div`
  font-size: 14px;
  color: #666;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperTotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`