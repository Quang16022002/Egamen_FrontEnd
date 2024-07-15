  import { configureStore } from '@reduxjs/toolkit'
  import counterReducer from './counter/counterSlice'
  import userReducer from './counter/userSlide'
  import orderReducer from './counter/orderSlice'
  import favoriteReducer from "./counter/favoriteSlice";
  export const store = configureStore({
    reducer: {
      counter: counterReducer,
      user:userReducer,
      order:orderReducer,
      favorite: favoriteReducer,
      devTools: process.env.NODE_ENV !== 'production',
    },
    
  })