import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import { getAllImage, removeAImage, removeAnImage } from "api/imageApi";

export const getAll = createAsyncThunk('/hinhanhs',async (params,thunkAPI) => {
    const listImg = await getAllImage(params);
    return listImg
})

// export const removeImg = createAsyncThunk('/hinhanhs/remove',async (params,thunkAPI) => {
//     const rmImg = await removeAnImage(params);
//     return rmImg
// })

const imageSlice = createSlice({
    name: 'images',
    initialState: {
        images: [],
        totalCount : 1,
    },
    reducers: {

        
    },
    extraReducers:{
        [getAll.fulfilled]: (state, action) => {
            state.images = action.payload.result.data
            state.totalCount = action.payload.result.totalCount
        },
        // [removeImg.fulfilled]: (state, action) => {
            
        // },
    }
})

const { reducer, actions } = imageSlice
export default reducer