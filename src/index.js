import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// 1、引入路由组件
import Router from "./router"
import * as serviceWorker from './serviceWorker';


// 1、系统自动创建render调用，将路由组件为最外层组件
ReactDOM.render(<Router />, document.getElementById('root'));


serviceWorker.unregister();
