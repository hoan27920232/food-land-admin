import axiosClient from "./axiosClient";
// get tat ca order
export const getAllOrder = (params) => {
    const url = '/donhangs';
    return axiosClient.get(url, {params})
} 
export const getFilterOrder = (params) => {
    const url = '/donhangs/filter';
    return axiosClient.get(url, {params})
} 
// lay 1 order theo id

export const getOrderById = (id) => {
    const url = `/donhangs/${id}`
    return axiosClient.get(url)
}

// lay cac order theo category

export const saveOrder = (params) => {
    const id = params._id
    let url = '/donhangs'
    if(id == 0){
        return axiosClient.post(url, params)
    }else{
        url = url + `/${id}`
        return axiosClient.put(url, params)
    }
}

export const removeOrder = (parameter) => {
    const url = `/donhangs/${parameter}`
    return axiosClient.delete(url)
}