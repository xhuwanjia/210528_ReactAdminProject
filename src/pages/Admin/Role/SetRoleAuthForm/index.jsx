import React, { Component } from "react";

import { Tree, Form, Input } from "antd";
import PropTypes from "prop-types";
import menuList from "../../../../config/menuConfig";

const Item = Form.Item;

export default class SetRoleAuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };

  constructor(props) {
    super(props);
    let { menus } = this.props.role;
    this.state = {
      checkedKeys: menus,
    };
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };

  // 为父组件提供最新menus
  getMenus = () => this.state.checkedKeys;

  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const treeData = [
      {
        title: "平台权限",
        key: "all",
        children: menuList,
      },
    ];

    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          treeData={treeData}
        />
      </div>
    );
  }
}
