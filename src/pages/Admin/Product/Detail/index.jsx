import React, { Component } from "react";

import { Card, List } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import "./index.less";
import LinkButton from "../../../../components/LinkButton";
import { BASE_IMG_URL } from "../../../../utils/constants";
import { reqCategory } from "../../../../api";

const Item = List.Item;
// 商品详情子路由
export default class ProductDetail extends Component {
  state = {
    pCategoryName: "", //一级分类名称
    categoryName: "", //二级分类名称
  };

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product;
    //一级分类下的商品
    if (pCategoryId === "0") {
      const result = await reqCategory(categoryId);
      const pCategoryName = result.data.name;
      this.setState({ pCategoryName });
      //二级分类下的商品
    } else {
      // 通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送，效率不高
      /*
        const result1 = await reqCategory(pCategoryId)
        const result2 = await reqCategory(categoryId)
        const pCategoryName = result1.data.name
        const categoryName = result2.data.name
      */
      // 需要一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const pCategoryName = results[0].data.name;
      const categoryName = results[1].data.name;
      this.setState({ pCategoryName, categoryName });
    }
  }

  render() {
    // 读取Home组件传递过来的数据
    const { name, desc, price, detail, imgs } =
      this.props.location.state.product;
    // 读取状态中的数据
    const { pCategoryName, categoryName } = this.state;

    const title = (
      <div>
        <LinkButton>
          <ArrowLeftOutlined
            onClick={() => this.props.history.goBack()}
            style={{ marginRight: 10, fontSize: 20 }}
          />
        </LinkButton>
        <span>商品详情</span>
      </div>
    );

    return (
      <Card className="product-detail" title={title}>
        <List itemLayout="vertical">
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>
              {pCategoryName}
              {categoryName ? " --> " + categoryName : ""}
            </span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {imgs.map((img) => (
                <img
                  key={img}
                  className="product-img"
                  src={BASE_IMG_URL + img}
                  alt="img"
                />
              ))}
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span
              dangerouslySetInnerHTML={{
                __html: detail,
              }}
            ></span>
          </Item>
        </List>
      </Card>
    );
  }
}
