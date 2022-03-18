import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import { getAllCustomer, getCustomerById, removeCustomer, saveCustomer } from "api/customer.js";

export const getAllCus = createAsyncThunk('/khachhangs',async (params,thunkAPI) => {
    const listCustomer = await getAllCustomer(params);
    return listCustomer
})

// export const saveCus = createAsyncThunk('/khachhangs/save', async(params, thunkAPI) => {
//     const save = await saveCustomer(params)
//     return save
// })
// export const deleteCustomer = createAsyncThunk('/khachhangs/delete', async (params, thunkAPI) => {
//     const remove = await removeCustomer(params);
//     return remove
// })

export const getCusById = createAsyncThunk('/khachhangs/show', async (params, thunkAPI) => {
    const getById = await getCustomerById(params);
    return getById
})
const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        totalCount : 1,
        loading: false,
    },
    reducers: {
       
    },
    extraReducers:{
        [getAllCus.pending]: (state,action) => {
            state.loading = true
        },
        [getAllCus.rejected]: (state,action) => {
            state.loading = false
        },
        [getAllCus.fulfilled]: (state, action) => {
            state.loading = false
            state.customers = action.payload.result.data
            state.totalCount = action.payload.result.totalCount
        },
        // [saveCus.fulfilled]: (state,action) => {
            
        // },
        // [deleteCustomer.fulfilled]: (state, action) => {
            
        // },
        [getCusById.fulfilled]: (state, action) => {
            
        }
    }
})

const { reducer, actions } = customerSlice
export const { removeImage  } = actions
export default reducer