import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteItems: JSON.parse(localStorage.getItem('favoriteItems')) || [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      state.favoriteItems.push(action.payload);
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
    },
    removeFavorite: (state, action) => {
      state.favoriteItems = state.favoriteItems.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
    },
    toggleFavorite: (state, action) => {
      const existingIndex = state.favoriteItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.favoriteItems.splice(existingIndex, 1);
      } else {
        state.favoriteItems.push(action.payload);
      }
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
