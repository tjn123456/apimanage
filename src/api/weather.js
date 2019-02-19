import http from "./util"


export function get_weather(data=''){
    return http.get('http://t.weather.sojson.com/api/weather/city/101010100',data)
}