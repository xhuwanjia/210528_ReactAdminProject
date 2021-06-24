import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Form, Select, Input } from "antd";

const Item = Form.Item;
const Option = Select.Option;

export default class AddUpdateForm extends PureComponent {
  formRef = React.createRef();

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.formRef);
  }

  render() {
    const { roles,user } = this.props;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    return (
      <Form {...formItemLayout} preserve={false} ref={this.formRef}>
        <Item
          label="用户名"
          initialValue={user.username}
          name="username"
          rules={[
            {
              required: true,
              message: "用户名必须输入!",
            },
            { max: 10, message: "用户名最多10位" },
          ]}
        >
          <Input autoComplete="off" placeholder="请输入用户名" />
        </Item>
        {user._id ? null : (
          <Item
            label="密码"
            initialValue={user.password}
            name="password"
            rules={[
              {
                required: true,
                message: "密码必须输入!",
              },
              { min: 6, max: 20, message: "密码必须大于6位小于20位" },
            ]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Item>
        )}
        <Item
          label="手机号"
          initialValue={user.phone}
          name="phone"
          rules={[
            {
              required: true,
              message: "手机号必须输入!",
            },
            { min: 11, max: 11, message: "手机号必须输入11位" },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Item>
        <Item
          label="邮箱"
          initialValue={user.email}
          name="email"
          rules={[
            {
              required: true,
              message: "邮箱必须输入!",
            },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Item>
        <Item
          label="角色"
          initialValue={user.role_id}
          name="role_id"
          rules={[
            {
              required: true,
              message: "角色必须选择!",
            },
          ]}
        >
          <Select placeholder="请选择角色">
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    );
  }
}
