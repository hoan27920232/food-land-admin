import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import { getAllCatProduct, removeCatProduct, saveCatProduct } from "api/categoryProduct.js";

export const getAllCategory = createAsyncThunk('/danhmucsps',async (params,thunkAPI) => {
    const listCatProduct = await getAllCatProduct(params);
    return listCatProduct
})

// export const saveCat = createAsyncThunk('/damhmucsps/save', async(params, thunkAPI) => {
//     const save = await saveCatProduct(params)
//     return save
// })

// export const deleteCat = createAsyncThunk('/danhmucs/delete', async (params, thunkAPI) => {
//     const removeCat = await removeCatProduct(params);
//     return removeCat
// })
const categoryProductSlice = createSlice({
    name: 'categoryProducts',
    initialState: {
        danhmucsp: [],
        totalCount : 1,
        loading: false
    },
    reducers: {  
    },
    extraReducers:{
        [getAllCategory.pending]: (state,action) => {
            state.loading = true
        },
        [getAllCategory.rejected]: (state,action) => {
            state.loading = false
        },
        [getAllCategory.fulfilled]: (state, action) => {
            state.danhmucsp = action.payload.result.data
            state.totalCount = action.payload.result.totalCount
            state.loading = false
        },
        // [saveCat.fulfilled]: (state,action) => {
            
        // },
        // [deleteCat.fulfilled]: (state, action) => {

        // }
    }
})

const { reducer } = categoryProductSlice
export default reducer