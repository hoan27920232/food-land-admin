import axiosClient from "./axiosClient";
// get tat ca product
export const getAllProduct = (params) => {
    const url = '/sanphams';
    return axiosClient.get(url, {params})
} 
// lay 1 bai viet theo slug
export const getProductBySlug = (slug) => {
    const url = `/sanphams/${slug}`
    return axiosClient.get(url)
}
// lay 1 bai viet theo id

export const getProductById = (id) => {
    const url = `/sanphams/${id}`
    return axiosClient.get(url)
}

// lay cac bai viet theo category
export const getProductByCategory = (idCategory) => {
    const url = '/sanphams'
    return axiosClient.get(url, { category : idCategory })
}

export const saveProduct = (params) => {
    const id = params._id
    let url = '/sanphams'
    if(!id){
        return axiosClient.post(url, params)
    }else{
        url = url + `/${id}`
        return axiosClient.put(url, params)
    }
}

export const removeProduct = (parameter) => {
    const url = `/sanphams/${parameter}`
    return axiosClient.delete(url)
}