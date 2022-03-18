import axiosClient from "./axiosClient";
// get tat ca danh muc sp
export const getAllCatProduct = (params) => {
    const url = '/danhmucsps';
    return axiosClient.get(url, {params})
} 

// lay 1 dm theo id

export const getCatProductById = (id) => {
    const url = `/danhmucsps/${id}`
    return axiosClient.get(url)
}


export const saveCatProduct = (parameter) => {
    let url = '/danhmucsps'
    if(parameter._id == 0)
    {
        // let paramsNew = { 
        //     TenDanhMucSP : parameter.TenDanhMucSP
        // }
        return axiosClient.post(url, parameter)
    }
    else{
        url = url +`/${parameter._id}`
        return axiosClient.put(url, parameter)
    }
}

export const removeCatProduct = (parameter) => {
    const url = `/danhmucsps/${parameter}`
    return axiosClient.delete(url)
}