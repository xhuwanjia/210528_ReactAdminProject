/*
  接口请求函数  
    要求：能根据接口文档定义接口请求函数
    包含应用中所有接口请求函数的模块，每个函数的返回值都是promise
*/
import jsonp from "jsonp";
import { message } from "antd";
import ajax from "./ajax";
const BASE = "";

// 1、登录
export const reqLogin = (username, password) =>
  ajax(BASE + "/login", { username, password }, "POST");

// 3、天气查询：jsonp请求的接口请求函数（利用高德的天气查询接口）
export const reqWeather = (adcode) => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=0f47388569163a307dd94bb6f6da1a40&city=${adcode}`;
    jsonp(url, {}, (err, data) => {
      // 如果请求成功
      if (!err && data.infocode === "10000") {
        // 取出需要的数据
        const { weather, temperature } = data.lives[0];
        resolve({ weather, temperature });
      } else {
        // 请求失败
        message.error("获取天气信息失败！");
      }
    });
  });
};
/*
  jsonp解决ajax跨域的原理
    1、jsonp只能解决get类型的ajax请求跨域问题
    2、jsonp请求不是ajax请求，而是一般的get请求
    3、基本原理
      浏览器端：
        动态生成<script>来请求后台接口（src就是接口的url）
        定义好用于接收响应数据的函数（fn），并将函数名通过请求参数提交给后台（callback=fn）
      服务器端：
        接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
      浏览器端：
        收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
*/

// 3、获取一级/二级分类列表
export const reqCategorys = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });

// 4、添加分类
export const reqAddCategory = (categoryName, parentId) =>
  ajax(BASE + "/manage/category/add", { categoryName, parentId }, "POST");

// 5、更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");

// 6、获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax(BASE + "/manage/product/list", { pageNum, pageSize });

// 7、搜索商品分页列表（根据商品名称/商品描述搜索）
// searchType：搜索的类型，productName/productDesc
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(BASE + "/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName,
  });

// 8、根据分类id获取一个分类
export const reqCategory = (categoryId) =>
  ajax(BASE + "/manage/category/info", { categoryId });

// 9、更新商品状态（下架/上架）
export const reqUpdateStatus = (productId, status) =>
  ajax(BASE + "/manage/product/updateStatus", { productId, status }, "POST");

// 10、删除上传的图片
export const reqDeleteImg = (name) =>
  ajax(BASE + "/manage/img/delete", { name }, "POST");

// 11、添加/更新商品
export const reqAddOrUpdateProduct = (product) =>
  ajax(
    BASE + "/manage/product/" + (product._id ? "update" : "add"),
    product,
    "POST"
  );

// 12、获取角色列表
export const reqRoles = () => ajax(BASE + "/manage/role/list");

// 13、添加角色
export const reqAddRole = (roleName) =>
  ajax(BASE + "/manage/role/add", { roleName }, "POST");

// 14、更新角色
export const reqUpdateRole = (role) =>
  ajax(BASE + "/manage/role/update", role, "POST");

// 15、获取用户列表
export const reqUsers = () => ajax(BASE + "/manage/user/list");

// 16、删除用户
export const reqDeleteUser = (userId) =>
  ajax(BASE + "/manage/user/delete", { userId }, "POST");

// 17、添加/更新用户
export const reqAddOrUpdateUser = (user) =>
  ajax(BASE + "/manage/user/" + (user._id ? "update" : "add"), user, "POST");
