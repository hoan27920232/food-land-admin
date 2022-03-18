import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,

    headers: {
        'content-type' : 'application/json'
    },
    // dung querystring handle params thay vi dung mac dinh cua axios
    // paramsSerializer: params => queryString.stringify(params)
})

axiosClient.interceptors.request.use((config)=> {
    const token = localStorage.getItem('token');
    const auth = token ? `Bearer ${token}` : '';
    config.headers.common['Authorization'] = auth;
    return config
})

axiosClient.interceptors.response.use((response) => {
    if(response && response.data) return response.data 
    return response
}, (error) => {
    throw error
})

export default axiosClient;