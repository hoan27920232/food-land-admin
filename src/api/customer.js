import axiosClient from "./axiosClient";
// get tat ca Customer
export const getAllCustomer = (params) => {
    const url = '/khachhangs';
    return axiosClient.get(url, {params})
} 

export const getCustomerBySlug = (slug) => {
    const url = `/khachhangs/${slug}`
    return axiosClient.get(url)
}

export const getCustomerById = (id) => {
    const url = `/khachhangs/${id}`
    return axiosClient.get(url)
}

export const saveCustomer = (params) => {
    const id = params._id
    let url = '/khachhangs'
    if(id == 0){
        return axiosClient.post(url, params)
    }else{
        url = url + `/${id}`
        return axiosClient.put(url, params)
    }
}
export const removeCustomer = (parameter) => {
    const url = `/khachhangs/${parameter}`
    return axiosClient.delete(url)
}