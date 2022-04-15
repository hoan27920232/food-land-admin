import axiosClient from "./axiosClient";
// get tat ca danh muc sp
export const getAllDiscount = (params) => {
    const url = '/discounts';
    return axiosClient.get(url, {params})
} 

// lay 1 dm theo id

export const getDiscountById = (id) => {
    const url = `/discounts/${id}`
    return axiosClient.get(url)
}


export const saveDiscount = (parameter) => {
    let url = '/discounts'
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

export const removeDiscount = (parameter) => {
    const url = `/discounts/${parameter}`
    return axiosClient.delete(url)
}