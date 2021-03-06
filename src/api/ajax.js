/*
    功能：能发送异步ajax请求的函数模块（封装axios库），函数的返回值是promise对象
    优化一：统一处理请求异常
      在外层包一个自己创建的promise对象
      在请求出错时，不去reject，而是显示错误提示
    优化二：异步得到的不是response，而是response.data
      在请求成功resolve时，resolve(response.data)


*/
import axios from "axios";
import { message } from "antd";

export default function ajax(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    let promise;
    // 1、执行异步ajax请求
    if (method === "GET") {
      //发GET请求
      promise = axios.get(url, {
        params: data, //指定请求参数
      });
    } else {
      //发POST请求
      promise = axios.post(url, data);
    }
    // 2、如果成功了，调用resolve()
    promise
      .then((response) => {
        resolve(response.data);
        // 3、如果失败了，不调用reject()，而是提示异常信息
      })
      .catch((error) => {
        message.error("请求出错了：" + error.message);
      });
  });
}
