import React from "react";
import ReactDOM from "react-dom";

// antd设置为中文，全局使用
import { ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";

import App from "./App";
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";

// 解决[Violation] Added non-passive event listener to a scroll-blocking ＜some＞ event.
// Passive Event Listeners——让页面滑动更加流畅的新特性
import 'default-passive-events'

// 读取localStorage中的user，保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);