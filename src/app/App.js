import React from 'react'
import { Row,Col } from 'antd'
import "antd/dist/antd.css"
import Header from "./../components/header"
import Footer from "./../components/footer"
import Navleft from "./../components/nav-left"
import "./../style/common.scss"


export default class App extends React.Component{
    render(){
        return(
            // 3、该组件为划分结构使用
            //span=‘3’为这个列占用3/24的大小
            //之后将行列结构里添加所展示的内容组件
           <Row className="container">
               <Col span='3' className="nav-left">
                    <Navleft />
               </Col>
               <Col span='21' className="main">
                    <Header />
                    <Row className="content">
                        {this.props.children}
                    </Row>
                    <Footer />
               </Col>
           </Row> 
        );
    }

}