import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { Menu } from "antd";

import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import "./index.less";

const { SubMenu } = Menu;

// 左侧导航组件
class LeftNav extends Component {
  /*
    根据menuList数组生成对应的标签数组
    使用 map + 递归调用
  */
  getMenuNodes_map = (menuList) => {
    return menuList.map((item) => {
      const { title, key, icon, children } = item;
      const path = this.props.location.pathname;
      if (!children) {
        return (
          <Menu.Item key={key} icon={icon}>
            <Link to={key}>{title}</Link>
          </Menu.Item>
        );
      } else {
        // 查找一个与当前请求路径匹配的子Item
        const cItem = children.find((cItem) => cItem.key === path);
        // 如果存在，说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = key;
        }
        return (
          <SubMenu key={key} icon={icon} title={title}>
            {this.getMenuNodes_map(children)}
          </SubMenu>
        );
      }
    });
  };

  /*
    根据menuList数组生成对应的标签数组
    使用 reduce + 递归调用
  */
  getMenuNodes_reduce = (menuList) => {
    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        const { title, key, icon, children } = item;
        const path = this.props.location.pathname;
        // 向pre添加<Menu.Item>
        if (!children) {
          pre.push(
            <Menu.Item key={key} icon={icon}>
              <Link to={key}>{title}</Link>
            </Menu.Item>
          );
          // 向pre添加<SubMenu>
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = children.find((cItem) => path.indexOf(cItem.key) === 0);
          // 如果存在，说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = key;
          }

          pre.push(
            <SubMenu key={key} icon={icon} title={title}>
              {this.getMenuNodes_reduce(children)}
            </SubMenu>
          );
        }
      }
      return pre;
    }, []);
  };

  // 判断当前登录用户对item是否有权限
  hasAuth = (item) => {
    const { key, isPublic, children } = item;

    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;

    // 1、如果当前用户是admin
    // 2、如果当前item是公开的
    // 3、当前用户有此item的权限：key在menus中
    // 显示该菜单项
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
      // 4、如果当前用户有此item的某个子item的权限，也要进行显示
    } else if (children) {
      return !!children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };

  // 第一次render之前执行一次，为第一次render渲染准备数据（必须同步的）
  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes_reduce(menuList);
  }

  render() {
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    //当前请求的是商品或其子路由界面
    if (path.indexOf("/product") === 0) {
      path = "/product";
    }
    // 得到需要打开菜单项的key
    const openKey = this.openKey;
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>后台系统</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}
/*
  withRouter高阶组件
    包装非路由组件，返回一个新的组件，新的组件向非路由组件传递三个属性：history、location、match
*/
export default withRouter(LeftNav);
