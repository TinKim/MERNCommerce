import React, { useEffect, useMemo, useState } from "react";
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal } from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Checkbox } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import { useDispatch, useSelector } from "react-redux";
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from "../../redux/slices/orderSlice";
import { convertPrice } from "../../utils";

const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const [listChecked, setListChecked] = useState([])
    const dispatch = useDispatch()

    const onChange = (e) => {
        if(listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    };

    const handleChangeCount = (type, idProduct) => {
        if (type === 'increase') {
            dispatch(increaseAmount({idProduct}))
        } else {
            dispatch(decreaseAmount({idProduct}))
        }
    }
    
    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({idProduct}))
    }

    const handleOnChangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }

    useEffect(() => {
        dispatch(selectedOrder({listChecked}))
    }, [listChecked])

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.discount * cur.amount))
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo > 200000) {
            return 15000
        } else if (priceMemo === 0) {
            return 0
        } else return 25000
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

    const handleRemoveAllOrder = () => {
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({listChecked}))
        }
    }

    return (
        <div style={{ background: '#f5f5f5', width: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto', padding: '2px 0' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Giỏ hàng</span>
                <div style={{ display: 'flex', fontSize: '13px', justifyContent: 'center' }}>
                    <WrapperLeft>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <Checkbox onChange={handleOnChangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm) </span>
                            </span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder}/>
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder>
                                        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                                            <img src={order?.image} alt="" style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                                            <div style={{
                                                width: '260px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                                                {/* <WrapperPriceDiscount>
                                                    {order?.price}
                                                </WrapperPriceDiscount> */}
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small"/>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 700 }}>{convertPrice(order?.price * order?.amount)}</span>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)}/>
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '5px' }}>
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '5px' }}>
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{`${priceDiscountMemo}%`}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '5px' }}>
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(deliveryPriceMemo)}</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm thuế VAT nếu có)</span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '360px',
                                border: 'none',
                                borderRadius: '4px',
                                marginLeft: '40px'
                            }}
                            textButton={'Mua hàng'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}
                        ></ButtonComponent>
                    </WrapperRight>
                </div>
            </div>
        </div>
    )
}

export default OrderPage