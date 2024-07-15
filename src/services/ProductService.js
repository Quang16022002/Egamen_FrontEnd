import  axios  from 'axios';
import { axiosJWT } from './UserService';
export const getAllProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/getAll`) 
    return res.data;
};

export const creteProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/create`, data) 
    return res.data;
};

export const getDetailsProduct = async (id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-details/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching product details for id ${id}:`, error);
      throw error; // Ném lại lỗi để cho phép thành phần gọi xử lý lỗi tiếp theo
    }
  };

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all-type`) 
    return res.data;
};


export const updateProduct = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_KEY}/product/update/${id}`, data) ;
        return res.data;

};


export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/product/delete-product/${id}`, { 
    
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)

};


