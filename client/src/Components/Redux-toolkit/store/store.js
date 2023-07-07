import { configureStore } from '@reduxjs/toolkit'
import itemsSliceReducer from '../Slice/itemsSlice';

export const store = configureStore({
  reducer: {
    itemsReducer: itemsSliceReducer,
  },
})