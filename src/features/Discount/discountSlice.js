import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import { getAllDiscount, removeDiscount, saveDiscount } from "api/discountApi";

export const getAllDis = createAsyncThunk('/discounts',async (params,thunkAPI) => {
    const listDiscounts = await getAllDiscount(params);
    return listDiscounts
})

// export const saveCat = createAsyncThunk('/damhmucsps/save', async(params, thunkAPI) => {
//     const save = await saveCatProduct(params)
//     return save
// })

// export const deleteCat = createAsyncThunk('/danhmucs/delete', async (params, thunkAPI) => {
//     const removeCat = await removeCatProduct(params);
//     return removeCat
// })
const discountSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        totalCount : 1,
        loading: false
    },
    reducers: {  
    },
    extraReducers:{
        [getAllDis.pending]: (state,action) => {
            state.loading = true
        },
        [getAllDis.rejected]: (state,action) => {
            state.loading = false
        },
        [getAllDis.fulfilled]: (state, action) => {
            state.discounts = action.payload.result.data
            state.totalCount = action.payload.result.totalCount
            state.loading = false
        },
        // [saveCat.fulfilled]: (state,action) => {
            
        // },
        // [deleteCat.fulfilled]: (state, action) => {

        // }
    }
})

const { reducer } = discountSlice
export default reducer