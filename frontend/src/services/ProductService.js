import axios from "axios"
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`)
    }
    return res.data
}

export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const createProduct = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
        if (res.data.status === 'ERR') {
            throw new Error(res.data.message); // Ném lỗi nếu phản hồi có trạng thái ERR
        }
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : error; // Ném lỗi nếu có lỗi từ API hoặc từ axios
    }
};

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    try {
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        if (res.data.status === 'ERR') {
            throw new Error(res.data.message); // Ném lỗi nếu phản hồi có trạng thái ERR
        }
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : error; // Ném lỗi nếu có lỗi từ API hoặc từ axios
    }
};

export const deleteProduct = async (id, access_token) => {
    try {
        const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        })
        if (res.data.status === 'ERR') {
            throw new Error(res.data.message); // Ném lỗi nếu phản hồi có trạng thái ERR
        }
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : error; // Ném lỗi nếu có lỗi từ API hoặc từ axios
    }
};

export const deleteManyProduct = async (access_token, data) => {
    try {
        const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        if (res.data.status === 'ERR') {
            throw new Error(res.data.message); // Ném lỗi nếu phản hồi có trạng thái ERR
        }
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : error; // Ném lỗi nếu có lỗi từ API hoặc từ axios
    }
};

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
    return res.data
}