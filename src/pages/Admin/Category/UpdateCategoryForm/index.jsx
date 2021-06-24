import React, { Component } from "react";
import PropTypes from "prop-types";

import { Form, Input } from "antd";

const Item = Form.Item;
// 更新分类的form组件
export default class UpdateCategoryForm extends Component {
  /* 
    表单默认值，只有初始化以及重置时生效
    antd4.x版本解决父组件传递给子组件值的时候动态显示initialValue值的问题：
      form表单要回填数据一般会想到的是initialValues，但是这是适用于初始化值的时候，initialValues 不能被 setState 动态更新，需要用 setFieldsValue 来更新 initialValues
      antd4.x 中使用setFieldsValue 是通过ref来进行操作
  */
  // 创建一个ref，绑定到Form上
  formRef = React.createRef();

  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired,
  };


  // 在组件完成更新后立即调用，初始化时不会被调用
  // 调用 setFieldsValue 更新 initialValues
  // componentDidUpdate() {
  //   console.log('componentDidUpdate')
  //   this.formRef.current.setFieldsValue({
  //     categoryName: this.props.categoryName,
  //   });
  // }

  // 执行一次，第一次render之前
  
  UNSAFE_componentWillMount() {
    // 调用父组件方法，通过实参赋值传递数据给父组件
    this.props.setForm(this.formRef);
  }

  render() {
    const { categoryName } = this.props;
    return (
      // ref绑定到Form身上
      <Form preserve={false} ref={this.formRef} onFinish={this.onFinish}>
        <Item
          // form表单要回填数据一般会想到的是initialValues，但是这是适用于初始化值的时候，initialValues这个值只在组件挂载的时候执行了一次， 当我们再次打开Modal窗口的时候并不会更新
          // initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新（还需要用resetFields()方法来清空输入数据，避免出错）
          // 或者直接设置Modal的destroyOnClose和Form的preserve（推荐）
          initialValue={categoryName}
          name="categoryName"
          rules={[
            {
              required: true,
              message: "分类名称必须输入!",
            },
            { max: 10, message: "分类名称最多10位" },
          ]}
        >
          <Input placeholder="请输入修改的分类名称" />
        </Item>
      </Form>
    );
  }
}
