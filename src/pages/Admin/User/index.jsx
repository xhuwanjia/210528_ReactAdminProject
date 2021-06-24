import React, { Component } from "react";

import { Card, Button, Table, Modal, message } from "antd";
import LinkButton from "../../../components/LinkButton";
import { formateDate } from "../../../utils/dateUtils";
import { PAGE_SIZE } from "../../../utils/constants";
import { reqAddOrUpdateUser, reqDeleteUser, reqUsers } from "../../../api";
import AddUpdateForm from "./AddUpdateForm";
// 用户管理路由
export default class User extends Component {
  state = {
    users: [],
    roles: [],
    loading: false,
  };

  initColumns = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton
              onClick={() => {
                this.showUpdate(user);
              }}
            >
              修改
            </LinkButton>
            <LinkButton
              onClick={() => {
                this.deleteUser(user);
              }}
            >
              删除
            </LinkButton>
          </span>
        ),
      },
    ];
  };

  // 根据roles数组，生成包含所有角色名的对象（属性名用角色id值）
  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
  };

  // 储存user，显示修改页面
  showUpdate = (user) => {
    this.user = user;
    this.setState({ isShow: true });
  };

  showAdd = () => {
    // 消除点击修改后添加的user，以便修改后再创建用户
    this.user = null;
    this.setState({ isShow: true });
  };

  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({ users, roles });
    }
  };

  // 删除用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确定删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功!");
          this.getUsers();
        } else {
          message.error("删除用户失败!");
        }
      },
    });
  };

  // 添加或更新用户
  addOrUpdateUser = () => {
    // 表单验证
    this.formRef.current.validateFields().then(async (values) => {
      this.setState({ isShow: false });
      // 如果user有值，则是更新，要给values添加_id用于更新用户
      if (this.user) {
        values._id = this.user._id;
      }
      const result = await reqAddOrUpdateUser(values);
      if (result.status === 0) {
        message.success(`${this.user ? "修改" : "更新"}用户成功`);
        this.getUsers();
      } else {
        message.error(`${this.user ? "修改" : "更新"}用户失败`);
      }
    });
  };

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, roles, isShow, loading } = this.state;
    const user = this.user || {};
    const title = (
      <Button
        onClick={() => {
          this.showAdd();
        }}
        type="primary"
      >
        创建用户
      </Button>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          destroyOnClose
          onOk={this.addOrUpdateUser}
          onCancel={() => this.setState({ isShow: false })}
        >
          <AddUpdateForm
            roles={roles}
            user={user}
            setForm={(formRef) => (this.formRef = formRef)}
          />
        </Modal>
      </Card>
    );
  }
}
