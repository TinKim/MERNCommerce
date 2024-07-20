import React, { useState, useEffect, useRef } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import slider4 from '../../assets/images/slider4.png'
import slider5 from '../../assets/images/slider5.jpg'
import slider6 from '../../assets/images/slider6.jpg'
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import { useSelector } from "react-redux";
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const refSearch = useRef()
    const [loading, setLoading] = useState(false)
    const [stateProducts, setStateProducts] = useState([])
    const [limit, setLimit] = useState(6)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        if (search?.length > 0 || refSearch.current) {
            setStateProducts(res?.data)
            return []
        } else {
            return res
        }
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    const { isLoading, data: products } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000
    });

    useEffect(() => {
        if (products?.data?.length > 0) {
            setStateProducts(products?.data)
        }
    }, [products])

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ height: 'auto', width: '1270px', margin: '0 auto' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5, slider6]} />
                    <WrapperProducts>
                        {stateProducts?.map((product) => {
                            return (
                                <CardComponent 
                                    key={product._id} 
                                    countInStock={product.countInStock} 
                                    description={product.description} 
                                    image={product.image} 
                                    name={product.name} 
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    sold={product.sold}
                                    discount={product.discount}
                                    id={product._id}
                                />
                            )
                        })}
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore
                            textButton="Xem thêm" type="outline" styleButton={{
                                border: '1px solid rgb(11, 116, 229)', color: `${products?.total === products?.data?.length ? '#fff' : 'rgb(11, 116, 229)'}`,
                                width: '240px', height: '38px', borderRadius: '4px'
                            }}
                            disabled={products?.total === products?.data?.length || products.totalPage === 1}
                            styleTextButton={{ fontWeight: 500 }}
                            onClick={() => setLimit((prev) => prev + 6)}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default HomePage