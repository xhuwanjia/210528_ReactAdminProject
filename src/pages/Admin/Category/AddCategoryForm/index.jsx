import React, { Component } from "react";
import PropTypes from "prop-types";

import { Form, Select, Input } from "antd";

const Item = Form.Item;
const Option = Select.Option;
// 添加分类的form组件
export default class AddCategoryForm extends Component {
  formRef = React.createRef();

  static propTypes = {
    categorys: PropTypes.array.isRequired, //一级分类数组
    parentId: PropTypes.string.isRequired, //父分类id
    setForm: PropTypes.func.isRequired,
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.formRef);
  }

  // componentDidUpdate(){
  //   this.formRef.current.setFieldsValue({
  //     parentId:this.props.parentId
  //   })
  // }

  render() {
    const { categorys, parentId } = this.props;
    return (
      // <Modal /> 和 Form 一起配合使用时，设置 destroyOnClose 也不会在 Modal 关闭时销毁表单字段数据，需要设置 <Form preserve={false} />
      <Form preserve={false} ref={this.formRef}>
        <Item name="parentId" initialValue={parentId}>
          <Select>
            <Option value="0">一级分类</Option>
            {categorys.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          name="categoryName"
          rules={[
            {
              required: true,
              message: "分类名称必须输入!",
            },
            { max: 10, message: "分类名称最多10位" },
          ]}
        >
          <Input placeholder="请输入要添加的分类名称" />
        </Item>
      </Form>
    );
  }
}
