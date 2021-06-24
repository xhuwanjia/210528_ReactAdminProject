import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";

import { PAGE_SIZE } from "../../../utils/constants";
import memoryUtils from "../../../utils/memoryUtils";
import storageUtils from "../../../utils/storageUtils";
import { formateDate } from "../../../utils/dateUtils";
import { reqAddRole, reqRoles, reqUpdateRole } from "../../../api";
import AddRoleForm from "./AddRoleForm";
import SetRoleAuthForm from "./SetRoleAuthForm";

// 角色管理路由
export default class Role extends Component {
  state = {
    roles: [], //所有角色列表
    role: {}, //选中的role
    isShowAdd: false, //是否显示添加界面
    isShowAuth: false, //是否显示设置权限界面
    loading: false,
  };

  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }

  initColumns = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  getRoles = async () => {
    this.setState({ loading: true });
    const result = await reqRoles();
    this.setState({ loading: false });
    if (result.status === 0) {
      const roles = result.data;
      this.setState({ roles });
    }
  };

  onRow = (role) => {
    return {
      //点击行
      onClick: (event) => {
        this.setState({ role });
      },
    };
  };

  addRole = () => {
    // 进行表单验证，只有通过才向下处理
    this.formRef.current.validateFields().then(async (values) => {
      // 隐藏确认框
      this.setState({ isShowAdd: false });
      // 收集数据
      const { roleName } = values;
      // 发送添加请求
      const result = await reqAddRole(roleName);
      // 根据结果更新列表显示
      if (result.status === 0) {
        message.success("添加角色成功");
        // 发请求更新显示
        // this.getRoles()

        // 新产生的角色
        const role = result.data;
        /* 更新roles状态，尽量不直接更新状态数据（即直接改动this.state.roles）
            const roles = this.state.roles
            roles.push(role)
            this.setState({roles})
            */
        // 推荐更新方式：基于原本的状态数据更新
        this.setState((state) => ({
          roles: [...state.roles, role],
        }));
      } else {
        message.error("添加角色失败");
      }
    });
  };

  updateRole = async () => {
    this.setState({ isShowAuth: false });
    const role = this.state.role;
    // 得到子组件SetRoleAuthForm最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    // 得到最新的授权时间
    role.auth_time = formateDate(Date.now());
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限，强制退出
      if (role._id === memoryUtils.user.role_id) {
        message.info("当前用户角色权限修改了，需要重新登录！");
        memoryUtils.user = {};
        storageUtils.removeUser();
        this.props.history.replace("/login");
      } else {
        message.success("设置角色权限成功");
        // role发生变化，则代表roles中的元素发生了变化，所以更新roles数组即可
        this.setState({
          roles: [...this.state.roles],
        });
      }
    } else {
      message.error("设置角色权限失败");
    }
  };

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth, loading } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAuth: true })}
          disabled={!role._id}
        >
          设置角色权限
        </Button>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            // 选择某个radio时的回调
            onSelect: (role) => {
              this.setState({ role });
            },
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          destroyOnClose
          onOk={this.addRole}
          onCancel={() => this.setState({ isShowAdd: false })}
        >
          <AddRoleForm setForm={(formRef) => (this.formRef = formRef)} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          destroyOnClose
          onOk={this.updateRole}
          onCancel={() => this.setState({ isShowAuth: false })}
        >
          <SetRoleAuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    );
  }
}
