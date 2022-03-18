import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import { getAllCatBlog, removeCatBlog, saveCatBlog } from "api/categoryBlog";

export const getAllCat = createAsyncThunk('/danhmucblogs',async (params,thunkAPI) => {
    const listCatBlog = await getAllCatBlog(params);
    return listCatBlog
})

// export const saveCat = createAsyncThunk('/danhmucblogs/save', async(params, thunkAPI) => {
//     const save = await saveCatBlog(params)
//     return save
// })

// export const deleteCat = createAsyncThunk('/danhmucblogs/delete', async (params, thunkAPI) => {
//     const remove = await removeCatBlog(params);
//     return remove
// })
const categoryBlogSlice = createSlice({
    name: 'categoryBlogs',
    initialState: {
        categoryBlogs: [],
        totalCount : 1,
        loading: false
    },
    reducers: {  
    },
    extraReducers:{
        [getAllCat.pending]: (state,action) => {
            state.loading = true
        },
        [getAllCat.rejected]: (state,action) => {
            state.loading = false
        },
        [getAllCat.fulfilled]: (state, action) => {
            state.categoryBlogs = action.payload.result.data
            state.totalCount = action.payload.result.totalCount
            state.loading = false
        },
        // [saveCat.fulfilled]: (state,action) => {
            
        // },
        // [deleteCat.fulfilled]: (state, action) => {

        // }
    }
})

const { reducer } = categoryBlogSlice
export default reducer