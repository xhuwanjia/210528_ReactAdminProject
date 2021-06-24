import React, { Component } from "react";

import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";

import LinkButton from "../../../components/LinkButton";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../../api";
import AddCategoryForm from "./AddCategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";

// 品类管理路由
export default class Category extends Component {
  state = {
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    loading: false, //是否正在获取表格数据中
    parentId: "0", //当前需要显示的分类列表的父分类ID
    parentName: "", //当前需要显示的分类列表的父分类名称
    showStatus: 0, //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
  };

  // 初始化Table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name", //指定显示数据对应的属性名
      },
      {
        title: "操作",
        width: 300,
        // category是代表表格的一行数据，是个对象
        render: (category) => (
          //返回需要显示的界面标签
          <span>
            <LinkButton
              onClick={() => {
                this.showUpdate(category);
              }}
            >
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };

  // 异步获取一级/二级分类列表
  // 参数parentId：如果没有指定就使用state中的，如果指定了就使用参数
  getCategorys = async (parentId) => {
    // 在发请求前，显示loading
    this.setState({ loading: true });
    parentId = parentId || this.state.parentId;
    const reslut = await reqCategorys(parentId);
    // 请求完成后，隐藏loading
    this.setState({ loading: false });
    if (reslut.status === 0) {
      // 取出分类数组（可能是一级也可能是二级的）
      const categorys = reslut.data;
      // 更新一级分类数组状态
      if (parentId === "0") {
        this.setState({ categorys });
      } else {
        // 更新二级分类数组状态
        this.setState({ subCategorys: categorys });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  // 显示指定一级分类对象的二级子列表
  showSubCategorys = (category) => {
    // 更新状态
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        //在状态更新且重新render后执行
        // console.log("parentId:",this.state.parentId)
        // 获取二级分类列表
        this.getCategorys();
      }
    );
    // setState不能立即获取最新的状态：因为setState是异步更新状态的
    // console.log("parentId:",this.state.parentId) //0
  };

  // 显示一级分类列表
  showCategory = () => {
    // 更新为显示一级分类列表的状态
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };

  // 响应点击取消：隐藏确定框
  handleCancel = () => {
    this.setState({ showStatus: 0 });
  };

  //显示添加确认框
  showAdd = () => {
    this.setState({ showStatus: 1 });
  };
  // 添加分类
  addCategory = () => {
    // 触发表单验证
    this.formRef.current.validateFields().then(async (values) => {
      // 隐藏确认框
      this.setState({ showStatus: 0 });
      // 收集数据，提交请求
      const { parentId, categoryName } = values;
      // 发送添加请求
      const result = await reqAddCategory(categoryName, parentId);
      if (result.status === 0) {
        // 添加的分类就是当前分类列表下的分类
        if (parentId === this.state.parentId) {
          // 重新发请求获取当前分类列表显示
          this.getCategorys();
        } else if (parentId === "0") {
          //在二级分类列表下添加一级分类，需要重新发请求获取一级分类列表，但不需要显示一级列表（不能修改state中的parentId）
          this.getCategorys("0");
        }
      }
    });
  };

  //显示更新确认框，第一次点击触发该事件是初始化UpdateCategoryForm组件，所以不会执行componentDidUpdate函数
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category;
    // 更新状态
    this.setState({ showStatus: 2 });
  };
  // 更新分类
  updateCategory = () => {
    this.formRef.current.validateFields().then(async (values) => {
      // 1.隐藏确认框
      this.setState({ showStatus: 0 });

      // 准备数据
      const categoryId = this.category._id;
      const { categoryName } = values;
      console.log(categoryName);

      // 2.发请求更新分类
      const result = await reqUpdateCategory({ categoryId, categoryName });
      if (result.status === 0) {
        // 3.重新显示列表
        this.getCategorys();
      }
    });
  };

  // 为第一次render渲染准备数据
  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  // 第一次render后执行异步任务：发送异步ajax请求
  componentDidMount() {
    // 获取一级分类列表
    this.getCategorys();
  }

  render() {
    // 读取状态数据
    const {
      categorys,
      subCategorys,
      parentId,
      parentName,
      loading,
      showStatus,
    } = this.state;
    // 读取要修改的分类对象，如果还没有指定一个空对象
    const category = this.category || {};
    // card的左侧
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
          <ArrowRightOutlined style={{ marginRight: 5 }} />
          <span>{parentName}</span>
        </span>
      );
    // card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <PlusOutlined />
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          bordered
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true,
          }}
        />
        {/* <Modal /> 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，设置 destroyOnClose */}
        {/* <Modal /> 和 Form 一起配合使用时，设置 destroyOnClose 也不会在 Modal 关闭时销毁表单字段数据，需要设置 <Form preserve={false} /> */}
        <Modal
          destroyOnClose={true}
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddCategoryForm
            categorys={categorys}
            parentId={parentId}
            setForm={(formRef) => (this.formRef = formRef)}
          />
        </Modal>
        <Modal
          destroyOnClose={true}
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          {/* category为空对象时，name为undefined，将其转换为空串 */}
          {/* 组件UpdateCategoryForm要在组件Modal中的visible变为true的时候才会被挂载，即第一次初始化 */}
          {/* 将子组件传递过来的formRef对象保存到父组件Category上 */}
          <UpdateCategoryForm
            categoryName={category.name ? category.name : ""}
            setForm={(formRef) => (this.formRef = formRef)}
          />
        </Modal>
      </Card>
    );
  }
}
