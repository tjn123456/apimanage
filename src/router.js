import React from "react"
import {HashRouter,Route,Switch,Redirect} from "react-router-dom"
import App from "./App"
import Home from "./pages/home"
import Apidebug from "./pages/apidebug"
import Admin from "./app/App"
import Login from "./pages/login"
import NoMatch from "./pages/nomatch"


export default class Router extends React.Component{
    
    render(){
        return(
            // 2、路由结构文件
            // 2、什么文件适合使用路由？
            // 答：需要做组件间跳转功能的场景，如果是数据渲染当前组件用ajax比较好
            <HashRouter>
                {/* 这个APP组件是this.props.childen,为什么要使用这个组件呢？
                答：因为下边Admin组件不是根路由，与它平级的还有登录页面路由，详情页面路由（这些都不是admin的子路由） 所以要向上抽象一层容器*/}
                <App>
                    <Switch>
                        {/* APP组件下有两个路由，login和admin其中admin还有自己的子路由 */}
                        <Route path='/login' component={Login}/>
                        {/* 下边的组件可以获取一个数字作为url的参数进行传递，接收参数的方法是，this.props.match.params.number */}
                        <Route paht='/admin' render={()=>
                            <Admin>

                                <Switch>
                                <Route path='/apidebug/:number' component={Apidebug}/>
                                <Route exact path='/apidebug' component={Home} />
                                {/* 重定向根目录到接口目录 */}
                                <Redirect from="/" to="/apidebug" />
                                <Route component={NoMatch} />
                                </Switch>
                            </Admin>
                        } />
                    </Switch>

                </App>
            </HashRouter>
        );
    }
}
