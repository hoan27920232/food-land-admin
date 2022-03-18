import axiosClient from "./axiosClient";
// get tat ca danh muc blog
export const getAllCatBlog = (params) => {
    const url = '/danhmucblogs';
    return axiosClient.get(url, {params})
} 

// lay 1 dm theo id
export const getCatBlogById = (id) => {
    const url = `/danhmucblogs/${id}`
    return axiosClient.get(url)
}


export const saveCatBlog = (parameter) => {
    let url = '/danhmucblogs'
    if(parameter._id == 0)
    {
        return axiosClient.post(url, parameter)
    }
    else{
        url = url +`/${parameter._id}`
        return axiosClient.put(url, parameter)
    }
}

export const removeCatBlog = (parameter) => {
    const url = `/danhmucblogs/${parameter}`
    return axiosClient.delete(url)
}