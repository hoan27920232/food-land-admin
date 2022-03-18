import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
  getAllProduct,
  getProductById,
  removeProduct,
  saveProduct,
} from "api/productApi";

export const getAll = createAsyncThunk(
  "/sanphams",
  async (params, thunkAPI) => {
    const listProduct = await getAllProduct(params);
    return listProduct;
  }
);

// export const savePro = createAsyncThunk(
//   "/sanphams/save",
//   async (params, thunkAPI) => {
//     const save = await saveProduct(params);
//     return save;
//   }
// );
// export const deletePro = createAsyncThunk(
//   "/sanphams/delete",
//   async (params, thunkAPI) => {
//     const removePro = await removeProduct(params);
//     return removePro;
//   }
// );

export const getById = createAsyncThunk(
  "/sanphams/show",
  async (params, thunkAPI) => {
    const getById = await getProductById(params);
    return getById;
  }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    totalCount: 1,
    loading: false,
    filter: [],
  },
  reducers: {
    // filterProducts: (state, action) => {
    //   console.log(current(state));
    //   console.log(action.payload)
    //   const formatData = action.payload?.map((p) => p?.sanpham);
    //   state.filter = state.products?.filter((p) => !formatData.includes(p._id));

    // },
    setFilter: (state, action) => {
      state.filter = state.products;
    },
  },
  extraReducers: {
    [getAll.pending]: (state,action) => {
      state.loading = true
  },
  [getAll.rejected]: (state,action) => {
      state.loading = false
  },
    [getAll.fulfilled]: (state, action) => {
      state.loading = false
      state.products = action.payload.result.data;
      state.filter = action.payload.result.data;
      state.totalCount = action.payload.result.totalCount;
    },
    // [savePro.fulfilled]: (state, action) => {},
    // [deletePro.fulfilled]: (state, action) => {},
    [getById.fulfilled]: (state, action) => {},
  },
});

const { reducer, actions } = productSlice;
export const {  setFilter } = actions;
export default reducer;
