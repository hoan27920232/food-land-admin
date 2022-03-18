import { configureStore,getDefaultMiddleware } from "@reduxjs/toolkit";
import blogSlice from 'features/Blog/blogSlice'
import imageSlice from 'features/HinhAnh/hinhanhSlice'
import categoryProductSlice from 'features/CategoryProduct/categoryProductSlice'
import productSlice from 'features/Product/productSlice'
import loginSlice from 'features/Login/loginSlice'
import userSlice from 'features/User/userSlice'
import customerSlice from 'features/KhachHang/customerSlice'
import categoryBlogSlice from 'features/CategoryBlog/categoryBlog'

import orderSlice from 'features/DonHang/orderSlice'
const rootReducer = {
    photos: blogSlice,
    images: imageSlice,
    categoryProducts: categoryProductSlice,
    products: productSlice,
    me: loginSlice,
    users: userSlice,
    categoryBlogs: categoryBlogSlice,
    blogs: blogSlice,
    customers: customerSlice,
    orders: orderSlice
}

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})
export default store