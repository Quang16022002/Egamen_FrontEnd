// services/ReviewService.js

import axios from 'axios';

export const addReview = async (reviewData) => {
  try {
    const response = await axios.post('/api/review/create', reviewData);
    return response.data;
  } catch (error) {
    throw new Error('Error adding review');
  }
};

export const getAllReview= async (productId) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/review/getall/${productId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching product details for id ${productId}:`, error);
    throw error; 
  }
};