import axiosClient from "./axiosClient";
// get tat ca product
// export const getAllImage = (params) => {
//     const url = '/hinhanhs';
//     return axiosClinet.get(url, {params})
// } 
// // lay 1 bai viet theo slug
// export const removeAImage = (id) => {
//     const url = `/sanphams/${id}`
//     return axiosClinet.delete(url)
// }

export const login = (params) => {
    const url = '/taikhoans/login'
    return axiosClient.post(url,params)
}

// get tat ca User
export const getAllUser= (params) => {
    const url = '/taikhoans';
    return axiosClient.get(url, {params})
} 

export const getUserById = (id) => {
    const url = `/taikhoans/${id}`
    return axiosClient.get(url)
}

export const saveUser = (params) => {
    const id = params._id
    let url = '/taikhoans'
    let urlRegister = '/taikhoans/register'
    if(id == 0){
        return axiosClient.post(urlRegister, params)
    }else{
        url = url + `/${id}`
        return axiosClient.put(url, params)
    }
}
export const removeUser = (parameter) => {
    const url = `/taikhoans/${parameter}`
    return axiosClient.delete(url)
}
export const me = () => {
    const url = '/taikhoans/me'
    return axiosClient.get(url)
}