import React, { Component } from "react";
import PropTypes from "prop-types";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

import getBase64 from "../../../../../utils/base64Utils";
import { reqDeleteImg } from "../../../../../api";
import { BASE_IMG_URL } from "../../../../../utils/constants";

// 用于图片上传的组件
export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array,
  };

  constructor(props) {
    super(props);

    let fileList = [];

    // 如果传入了imgs属性
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: BASE_IMG_URL + img,
      }));
    }

    // 初始化状态
    this.state = {
      previewVisible: false, //标识是否显示大图预览
      previewImage: "", // 大图的url
      fileList,//所有已上传的图片
    };
  }

  // 获取所有已上传图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map((file) => file.name);
  };

  // 隐藏modal
  handleCancel = () => this.setState({ previewVisible: false });

  // 显示指定file对应的大图
  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*
    file:当前操作的图片文件（上传/删除）
    fileList:所有已上传图片文件对象的数组
    file和fileList[fileList.length-1]不是同一个对象，但是表达的是同一个文件（内容一样）
  */
  handleChange = async ({ file, fileList }) => {
    // 一旦上传成功，将当前上传的文件的信息进行修正(name，url)
    if (file.status === "done") {
      const result = file.response; // {status:0,data:{name:'xxx.jpg',url:'图片地址'}}
      if (result.status === 0) {
        message.success("上传图片成功");
        const { name, url } = result.data;
        // 修正fileList的最后一个元素
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error("上传图片失败");
      }
      // 删除图片
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("删除图片成功");
      } else {
        message.error("删除图片失败");
      }
    }
    // 在操作（删除/上传）过程中更新状态
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <ImgCrop rotate>
          <Upload
            // 上传路径，发送的ajax请求
            action="/manage/img/upload"
            // 设置接受上传的文件类型，只接收图片格式
            accept="image/*"
            // 上传列表的内建样式：text picture picture-card
            listType="picture-card"
            // 发到后台的文件参数名，默认是file
            name="image"
            // 已上传的文件列表（受控）
            fileList={fileList}
            // 上传中、完成、失败都会调用这个函数。
            onChange={this.handleChange}
            // 点击文件链接或预览图标时的回调
            onPreview={this.handlePreview}
          >
            {fileList.length < 5 ? uploadButton : null}
          </Upload>
        </ImgCrop>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
