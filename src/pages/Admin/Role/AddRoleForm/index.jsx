import React, { Component } from "react";
import PropTypes from "prop-types";

import { Form, Input } from "antd";

const Item = Form.Item;
// 添加角色的form组件
export default class AddRoleForm extends Component {
  formRef = React.createRef();

  static propTypes = {
    setForm: PropTypes.func.isRequired,
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.formRef);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      // <Modal /> 和 Form 一起配合使用时，设置 destroyOnClose 也不会在 Modal 关闭时销毁表单字段数据，需要设置 <Form preserve={false} />
      <Form preserve={false} ref={this.formRef}>
        <Item
          name="roleName"
          label="角色名称"
          {...formItemLayout}
          rules={[
            {
              required: true,
              message: "角色名称必须输入!",
            },
            { max: 10, message: "角色名称最多10位" },
          ]}
        >
          <Input placeholder="请输入要添加的角色名称" />
        </Item>
      </Form>
    );
  }
}
