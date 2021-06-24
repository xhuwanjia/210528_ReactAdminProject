import React, { Component } from "react";
import { Redirect } from "react-router";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { reqLogin } from "../../api";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import "./index.less";
import logo from "../../assets/images/logo.png";

/*
   前台表单验证 与 数据收集
    1、用户名/密码的合法性要求:
        1). 必须输入
        2). 必须大于等于 4 位
        3). 必须小于等于 12 位
        4). 必须是英文、数字或下划线组成
   async和await
    作用：
      简化promise对象的使用，不用再使用.then来指定成功或失败的回调函数
      以同步编码（没有回调函数了）方式实现异步流程
    在返回promise对象的表达式左侧写await，不想要promise，而想要promise异步执行成功的value数据
    await所在函数（最近的）定义的左侧写async
   维持登录和自动登录
    第一次登录，会将user保存到内存中和localStorage中
    登录后，刷新页面依然是已登录状态（维持登录，读取localStorage中的user到内存中）
    登录后，关闭浏览器再打开浏览器访问依然是已登录状态（自动登录，读取localStorage中的user到内存中）
    登录后，访问登录路径自动跳转到管理界面
*/

// 登录的路由组件
export default class Login extends Component {
  // 提交表单且数据验证成功后回调事件
  onFinish = async (values) => {// values是表单数据，是个对象
    const { username, password } = values;
    // 外层不处理请求错误，在内层（ajax.js）统一处理
    const result = await reqLogin(username, password);//{status:0,data:} {status:1,msg:'xxx'}
    if (result.status === 0) {
      // 登录成功
      // 提示登录成功
      message.success("登录成功");
      
      // 保存user
      const user = result.data
      memoryUtils.user = user //保存在内存中（刷新、关闭网页，内存中的user会消失）
      storageUtils.saveUser(user)//保存到localStorage中（每次刷新、打开页面，若localStorage中有，就将localStorage中的user读到内存中，在入口js中实现）

      // 跳转到管理界面（事件回调函数中的跳转）
      this.props.history.replace("/");
    } else {
      //登录失败
      // 提示错误信息
      message.error(result.msg);
    }
  };

  // 对密码进行自定义验证
  validatePwd = (rule, value, callback) => {
    const length = value && value.length;
    const pwdReg = /^[a-zA-Z0-9_]+$/;
    if (!value) {
      // callback如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误
      callback("必须输入密码");
    } else if (length < 4) {
      callback("密码必须大于等于4位");
    } else if (length > 12) {
      callback("密码必须小于等于12位");
    } else if (!pwdReg.test(value)) {
      callback("密码必须是英文、数字或下划线组成");
    } else {
      callback();
    }
  };
  
  render() {
    // 如果用户已经登录，访问登录路径会自动跳转到管理界面
    const user = memoryUtils.user
    if(user&&user._id){
      return <Redirect to="/"/>
    }
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          {/* antd4表单，默认不会自动提交 */}
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              username: "admin",
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                // 声明式验证: 直接使用别人定义好的验证规则进行验证
                {
                  required: true,
                  whitespace: true,
                  message: "用户名必须输入!",
                },
                { min: 4, message: "用户名至少4位" },
                { max: 12, message: "用户名最多12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须是英文、数字或下划线组成",
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined
                    style={{ color: "rgba(0,0,0,.25)" }}
                    className="site-form-item-icon"
                  />
                }
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ validator: this.validatePwd }]}>
              <Input
                prefix={
                  <LockOutlined
                    style={{ color: "rgba(0,0,0,.25)" }}
                    className="site-form-item-icon"
                  />
                }
                type="password"
                placeholder="密码"
                autoComplete="false"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}