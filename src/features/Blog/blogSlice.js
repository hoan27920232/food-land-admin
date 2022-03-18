import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import { getAllBlog, getBlogById, getBlogsByCategory, removeBlog , saveBlog} from "api/blogApi.js";

export const getAllBl = createAsyncThunk('/blogs/index',async (params,thunkAPI) => {
    const listBlog = await getAllBlog(params);
    return listBlog
})

export const getById = createAsyncThunk('/blogs/show', async (params, thunkAPI) => {
    const getById = await getBlogById(params);
    return getById
})

export const getByCategory = createAsyncThunk('/blogs', async (params, thunkAPI) => {
    const getBlogByCat = await getBlogsByCategory(params);
    return getBlogByCat
})

// export const saveBl= createAsyncThunk('/blogs/save', async(params, thunkAPI) => {
//     const save = await saveBlog(params)
//     return save
// })
// export const deleteBlog = createAsyncThunk('/blogs/delete', async (params, thunkAPI) => {
//     const remove = await removeBlog(params);
//     return remove
// })

const blogSlice = createSlice({
    name: 'blogs',
    initialState: {
        blogs: [],
        totalCount : 1,
        loading: false,
    },
    reducers: {
   
        
    },
    extraReducers:{
        [getAllBl.pending]: (state, action) => {
            state.loading = true
        },
        [getAllBl.rejected]: (state, action) => {
            state.loading = false
        },
        [getAllBl.fulfilled]: (state, action) => {
            state.loading = false
            state.blogs = action.payload.result.data
            state.totalCount = action.payload.result.totalCount
        },
        [getById.fulfilled]: (state, action) => {
            
        },
        [getByCategory.fulfilled]: (state, action) => {
            
        },
        // [saveBl.fulfilled]: (state,action) => {
            
        // },
        // [deleteBlog.fulfilled]: (state, action) => 
        // {},
    }
})

const { reducer, actions } = blogSlice
export const { removeImage  } = actions
export default reducer