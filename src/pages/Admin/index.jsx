import React, { Component } from "react";
import { Route,Switch,Redirect } from "react-router";
import { Layout } from "antd";

import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/LeftNav";
import Header from "../../components/Header";
import Home from './Home'
import Category from './Category'
import Product from './Product'
import User from './User'
import Role from './Role'
import Bar from './Bar'
import Line from './Line'
import Pie from './Pie'

const { Footer, Sider, Content } = Layout;

// 后台管理的路由组件
export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    // 如果内存中没有user，说明当前没有登录
    if (!user || !user._id) {
      // 自动跳转到登录界面（在render中的跳转）
      return <Redirect to="/login" />;
    }
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin:'20px',backgroundColor: "white" }}>
            <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/category" component={Category}/>
              <Route path="/product" component={Product}/>
              <Route path="/user" component={User}/>
              <Route path="/role" component={Role}/>
              <Route path="/bar" component={Bar}/>
              <Route path="/line" component={Line}/>
              <Route path="/pie" component={Pie}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#cccccc" }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
