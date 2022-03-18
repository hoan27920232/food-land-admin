import axiosClient from "./axiosClient";
// get tat ca blog
export const getAllBlog = (params) => {
    const url = '/blogs';
    return axiosClient.get(url, {params})
} 
// lay 1 bai viet theo slug
export const getBlogBySlug = (slug) => {
    const url = `/blogs/${slug}`
    return axiosClient.get(url)
}
// lay 1 bai viet theo id

export const getBlogById = (id) => {
    const url = `/blogs/${id}`
    return axiosClient.get(url)
}

// lay cac bai viet theo category
export const getBlogsByCategory = (idCategory) => {
    const url = '/blogs'
    return axiosClient.get(url, { category : idCategory })
}

export const saveBlog = (params) => {
    const id = params._id
    let url = '/blogs'
    if(id == 0){
        return axiosClient.post(url, params)
    }else{
        url = url + `/${id}`
        return axiosClient.put(url, params)
    }
}
export const removeBlog = (parameter) => {
    const url = `/blogs/${parameter}`
    return axiosClient.delete(url)
}