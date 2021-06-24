/*
  用来进行localStorage数据存储管理的工具模块
*/
// 使用这个库的作用：1、针对所有浏览器，低版本都可以 2、语法更加简洁
import store from 'store'

const USER_KEY = "user_key";
//eslint-disable-next-line
export default {
  // 保存user
  saveUser(user) {
    // localStorage.setItem(USER_KEY, JSON.stringify(user));
    store.set(USER_KEY,user)
  },
  // 读取user
  getUser() {
    // return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    return store.get(USER_KEY)||{}
  },
  // 删除user
  removeUser() {
    // localStorage.removeItem(USER_KEY);
    store.remove(USER_KEY)
  },
};
