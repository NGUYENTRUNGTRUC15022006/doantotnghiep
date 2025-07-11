import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { combineReducers } from 'redux'

import productReducer from '../redux/slides/productSlide'
import userReducer from '../redux/slides/userSlide'
import orderReducer from '../redux/slides/orderSlide'

// ✅ Cấu hình redux-persist cho order
const persistConfig = {
  key: 'order',
  storage,
  whitelist: ['orderItems'], // chỉ persist field này
}

// ✅ Gộp reducer
const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  order: persistReducer(persistConfig, orderReducer), // dùng persisted reducer
})

// ✅ Tạo store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // cần tắt vì redux-persist dùng non-serializable data
    }),
})

// ✅ Persistor để cung cấp cho <PersistGate />
export const persistor = persistStore(store)