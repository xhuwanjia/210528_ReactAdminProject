import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProductHome from "./Home";
import ProductDetail from "./Detail";
import ProductAddUpdate from "./AddUpdate";

// 商品管理路由
export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          {/* 多级路由默认模糊匹配，若是将/product放在最前面，那么/product/addupdate和/product/detail都会区匹配/product */}
          {/* 解决方法就是：①将/product放在最后 ②设置/product为精准匹配（extra） */}
          <Route path="/product/addupdate" component={ProductAddUpdate} />
          <Route path="/product/detail" component={ProductDetail} />
          <Route exact path="/product" component={ProductHome} />
          <Redirect to="/product" />
        </Switch>
      </div>
    );
  }
}
