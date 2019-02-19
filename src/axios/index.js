import axios from "axios"


export default class Axios {
    static get_ajax(options){
        let baseApi = "https://www.easy-mock.com/mock/5c554aa4b4757d1cc48f130d/mock"
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:baseApi,
                timeout:50000,
                params:(options.data && options.data.params) || '',
            }).then((response)=>{
                if(response.status == "200"){
                    let res = response.data;
                    resolve(res);
                }else{
                    reject(response.data)
                }
            })
        })
    }
}