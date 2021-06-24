import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { Modal } from "antd";

import LinkButton from "../LinkButton";
import { reqWeather } from "../../api";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { formateDate } from "../../utils/dateUtils";

import "./index.less";

// 头部组件
class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), //当前时间字符串
    weather: "", //天气文本
    temperature: "", //温度
  };

  getTime = () => {
    // 每隔1s获取当前时间，并更新状态数据currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  getWeather = async () => {
    // 调用接口请求函数获取数据
    const { weather, temperature } = await reqWeather("510100");
    this.setState({ weather, temperature });
  };

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      // 如果当前item对象的key与path一样，item的title就是需要显示的title
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find((cItem) => path.indexOf(cItem.key)===0);
        // 有值则找到
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  getTitle_recursion = (menuList) => {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    menuList.forEach((item) => {
      // 如果当前item对象的key与path一样，item的title就是需要显示的title
      if (item.key === path) {
        this.title = item.title;
      } else if (item.children) {
        this.getTitle(item.children);
      }
    });
    return this.title;
  };

  // 退出登录
  logout = () => {
    // 显示确认框
    Modal.confirm({
      title: "确定退出吗?",
      onOk: () => {
        // 删除保存的user数据
        storageUtils.removeUser();
        memoryUtils.user = {};

        // 跳转到login界面
        this.props.history.replace("/login");
      },
    });
  };

  // 第一次render之后执行一次，一般在此执行异步操作：发ajax请求，启动定时器
  componentDidMount() {
    // 获取当前时间（动态）
    this.getTime();
    // 获取当前天气（动态）
    this.getWeather();
  }

  // 当前组件卸载之前调用
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId);
  }

  render() {
    const { currentTime, weather, temperature } = this.state;
    const username = memoryUtils.user.username;
    const title = this.getTitle();
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <span className="header-bottom-right-tmp">{temperature}℃</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
