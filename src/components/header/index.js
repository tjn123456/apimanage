import React from 'react'
import {Row , Col} from "antd"
import "./header.scss"
import Util from "../../utils/utils"
import {get_weather} from "../../api/weather"

export default class Header extends React.Component{
    // state = {}
    componentWillMount(){
        this.setState({
            "username":"tianjn"
        })
        //setInterval是每个X秒执行一段code
        setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime())
            this.setState({
                "sysTime":sysTime
            })
        },1000)
        this.get_weather_today().then(res => 
            this.setState({
                weather:res.data.data.forecast[0].type,
                wind:res.data.data.forecast[0].fx+res.data.data.forecast[0].fl
            })
        );
    }
    //async为异步函数，返回的内容为promise对象使用.then回调方法访问内部的值
    async get_weather_today(data){
        const res = await get_weather(data)
        return res
    }

    render(){
        return(
            <div className="header">
                <Row className="header-top">
                    <Col span="24">
                    <span>欢迎{this.state.username}</span>
                    <a href="#">退出</a>
                    </Col>
                </Row>
                <Row className="breadcrumb">
                    <Col span="4" className="breadcrumb-title">
                        首页
                    </Col>
                    <Col span="20" className="weather">
                      <span className="date">{this.state.sysTime}</span>
                      {this.state.weather}
                      {this.state.wind}
                    </Col>
                </Row>
            </div>
        );
    }
}