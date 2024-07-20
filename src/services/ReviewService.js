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
