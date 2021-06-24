import React, { Component } from "react";

import { Card, Form, Input, Cascader, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import LinkButton from "../../../../components/LinkButton";
import { reqAddOrUpdateProduct, reqCategorys } from "../../../../api";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";

const { Item } = Form;
const { TextArea } = Input;
// 添加修改商品子路由
export default class ProductAddUpdate extends Component {
  state = {
    options: [],
  };

  // 在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。
  constructor(props) {
    super(props);
    // 创建用来保存有ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));

    // 如果是二级分类商品的更新，回显数据时需要显示二级分类列表
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );

      // 关联到对应的一级option上
      targetOption.children = childOptions;
    }

    // 更新options状态
    this.setState({
      options,
    });
  };

  // 异步获取一级、二级分类列表并显示
  // async函数的返回值是一个新的Promise对象，promise的结果和值由async的结果来决定
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      // 如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys);
        // 二级分类
      } else {
        // 返回二级列表，当前async函数返回的promise对象就是成功的，且值为categorys
        return categorys;
      }
    }
  };

  // 用于加载下一级列表的回调函数
  loadData = async (selectedOptions) => {
    // 得到当前选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类，请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    // 二级分类列表有值
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 关联到当前option上
      targetOption.children = childOptions;
      // 当前选中的分类没有二级分类
    } else {
      targetOption.isLeaf = true;
    }
    // 更新options状态
    this.setState({ options: [...this.state.options] });
  };

  // 自定义验证函数，验证价格
  validatePrice = (rule, value, callback) => {
    // value是字符串，做隐式类型转换变为number
    if (value * 1 > 0) {
      callback(); //验证通过
    } else {
      callback("价格必须大于0"); //验证未通过
    }
  };

  // 提交表单且数据验证成功后回调事件
  onFinish = async(values) => {
    // 1、收集数据，并封装成product对象
    const {name,desc,price,categoryIds} = values
    let pCategoryId,categoryId
    if(categoryIds.length===1){
      pCategoryId = '0'
      categoryId = categoryIds[0]
    }else{
      pCategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    }
    // 得到子组件PicturesWall的imgs数组
    const imgs = this.pw.current.getImgs();
    // 得到子组件RichTextEditor的商品详情
    const detail = this.editor.current.getDetail();
    const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
    
    // 如果是更新，需要添加_id
    if(this.isUpdate){
      product._id = this.product._id
    }

    // 2、调用接口请求函数去添加/更新商品
    const result = await reqAddOrUpdateProduct(product)

    // 3、根据结果提示
    if(result.status===0){
      message.success(`${this.isUpdate?'更新':'添加'}商品成功！`)
      this.props.history.goBack()
    }else{
      message.error(`${this.isUpdate?'更新':'添加'}商品失败！`)
    }
  };

  componentDidMount() {
    this.getCategorys("0");
  }

  UNSAFE_componentWillMount() {
    // 取出携带的state，如果是添加则没值，否则有值
    const product = this.props.location.state;
    console.log(product)

    // 保存是否是更新的标识
    this.isUpdate = !!product;
    // 保存商品，如果没有，设置为空对象，避免报错
    this.product = product || {};
  }

  render() {
    const { isUpdate, product } = this;
    // 用于修改页面级联默认显示
    const { pCategoryId, categoryId, imgs,detail } = product;
    // 用来接收级联分类id的数组
    const categoryIds = [];
    if (isUpdate) {
      // 一级分类的商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
        // 二级分类的商品
      } else {
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }

    const title = (
      <span>
        <LinkButton
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          <ArrowLeftOutlined />
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label的宽度
      wrapperCol: { span: 8 }, //右侧包裹的宽度
    };

    return (
      <Card title={title}>
        <Form onFinish={this.onFinish} {...formItemLayout}>
          <Item
            name="name"
            initialValue={product.name}
            label="商品名称"
            rules={[{ required: true, message: "商品名称必须输入" }]}
          >
            <Input placeholder="请输入商品名称" />
          </Item>

          <Item
            name="desc"
            initialValue={product.desc}
            label="商品描述"
            rules={[{ required: true, message: "商品描述必须输入" }]}
          >
            <TextArea
              placeholder="请输入商品描述"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Item>
          <Item
            name="price"
            initialValue={product.price}
            label="商品价格"
            rules={[
              { required: true, message: "商品价格必须输入" },
              { validator: this.validatePrice },
            ]}
          >
            <Input addonAfter="元" type="number" placeholder="请输入商品价格" />
          </Item>
          <Item
            name="categoryIds"
            initialValue={categoryIds}
            label="商品分类"
            rules={[{ required: true, message: "商品分类必须指定" }]}
          >
            <Cascader
              placeholder="请指定商品分类"
              options={this.state.options} //需要显示的列表数据数组
              loadData={this.loadData} //当选择某个列表项，加载下一级列表的回调
            />
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
            name="detail"
            label="商品详情"
          >
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button htmlType="submit" type="primary">
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
/*
  1、子组件调用父组件方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
  2、父组件调用子组件方法：在父组件中通过ref得到子组件标签对象（也就是组件实例对象）调用其方法
*/
