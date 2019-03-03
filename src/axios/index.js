import axios from "axios"


export const get_ajax = (options) => {
    let baseApi = "http://127.0.0.1:5001"
    return axios({
        url:options.url,
        method:'get',
        baseURL:baseApi,
        timeout:50000,
        params:(options.data && options.data.params) || '',
    })
 }

 export const post_ajax = (options) => {
    let baseApi = "http://127.0.0.1:5001"
    return axios({
        url:options.url,
        method:'post',
        baseURL:baseApi,
        data:options.data,
    })
 }

// export default class Axios {
//     static get_ajax(options){
//         let baseApi = "http://127.0.0.1:5001"
//         return new Promise((resolve,reject)=>{
//             axios({
//                 url:options.url,
//                 method:'get',
//                 baseURL:baseApi,
//                 timeout:50000,
//                 params:(options.data && options.data.params) || '',
//             }).then((response)=>{
//                 if(response.status == "200"){
//                     let res = response.data;
//                     resolve(res);
//                 }else{
//                     reject(response.data)
//                 }
//             })
//         })
//     }
// }