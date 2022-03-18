import axiosClinet from "./axiosClient";
// get tat ca product
export const getAllImage = (params) => {
    const url = '/hinhanhs';
    return axiosClinet.get(url, {params})
} 
// lay 1 bai viet theo slug
export const removeAnImage = (id) => {
    const url = `/hinhanhs/${id}`
    return axiosClinet.delete(url)
}


