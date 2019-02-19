import React from 'react'
import "./footer.scss"

export default class Footer extends React.Component{
    render(){
        return(
            <div className="footer">
                版权所有：熊猫儿科测试部&相关研发（推荐使用谷歌浏览器，可以获得更佳操作页面体验）技术支持：Mr.Tian
            </div>
        );
    }
}