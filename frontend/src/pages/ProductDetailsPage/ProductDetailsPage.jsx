import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    
    return (
        <div style={{ height: '100vh', width: '100%', background: '#efefef' }}>
            <div style={{ width: '1270px', height: '100%', margin: '0 auto', fontSize: '15px', padding: '2px 0' }}>
                <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => {navigate('/')}}>
                    Trang chủ
                </span>
                {' > '}Chi tiết sản phẩm
                <ProductDetailsComponent idProduct={id}/>
            </div>
        </div>
    )
}

export default ProductDetailsPage