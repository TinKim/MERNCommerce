import axios from "axios";

export const getConfig = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`);
        if (res.data.status === 'ERR') {
            throw new Error(res.data.message); // Ném lỗi nếu phản hồi có trạng thái ERR
        }
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : error; // Ném lỗi nếu có lỗi từ API hoặc từ axios
    }
};