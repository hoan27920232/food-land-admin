import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Table, Popconfirm, Button, Drawer, Space, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCat,
  saveCat,
} from "features/CategoryBlog/categoryBlog";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

import AddEdit from "../AddEdit";
import { saveCatBlog ,removeCatBlog } from "api/categoryBlog";
ListCategoryBlog.propTypes = {};

function ListCategoryBlog(props) {
  const {t} = useTranslation();
  const data = useSelector((state) => state.categoryBlogs.categoryBlogs);
  const total = useSelector((state) => state.categoryBlogs.totalCount);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const loading = useSelector((state) => state.categoryBlogs.loading);

  const [valueForm, setValueForm] = useState({
    TenDanhMucBlog: "",
    _id: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
  });
  const form = useRef();
  const column = [
    {
      title: "ID",
      dataIndex: "_id",
      sorter: (a, b) => a.MaDanhMucBlog - b.MaDanhMucBlog,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              confirm();
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
              onClick={() => confirm()}
            >
              Search
            </Button>
            <Button
              size="small"
              style={{ width: 90 }}
              onClick={() => clearFilters()}
            >
              Reset
            </Button>
            {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              
            }}
          >
            Filter
          </Button> */}
          </Space>
        </div>
      ),
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
    {
      title: t&&t ("categoryBlog.category"),
      dataIndex: "TenDanhMucBlog",
      sorter: (a, b) => a.TenDanhMucBlog - b.TenDanhMucBlog,
    },
    {
      title: t&&t ("button.action"),
      dataIndex: "",
      key: "x",
      render: (record) => (
        <div>
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => handleConfirmDelete(record._id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="link" danger>
            {t("button.delete")}
            </Button>
          </Popconfirm>

          <Button type="link" onClick={() => handleOpen(record)}>
          {t("button.edit")}
          </Button>
        </div>
      ),
    },
  ];

  const handleOpen = (formValue) => {
    if (formValue) {
      setValueForm({ ...valueForm, ...formValue });
    }
    setVisible(true);
  };
  const handleClose = () => {
    setValueForm({
      TenDanhMucBlog: "",
      _id: 0,
    });
    setVisible(false);
  };

  const handleConfirmDelete = async (id) => {
   
      const action = await removeCatBlog(id).then(res => message.success("Delete category success",0.4)).catch(err =>{
        message.error(err.response.data.message,0.2)
      });
      handleReloadData();
 
  };
  const handleReloadData = () => {
    const action = getAllCat();
    dispatch(action);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    try {
      let sort = "";
      console.log(filters);
      if (sorter) {
        sort += sorter.order == "ascend" ? "" : "-";
      }
      sort += sorter.field ? sorter.field : "_id";
      let action;
      if (sort != "") {
        if (filters && filters._id) {
          action = getAllCat({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            sort: sort,
            keywords: filters?._id[0],
          });
        } else {
          action = getAllCat({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            sort: sort,
          });
        }
      } else {
        if (filters && filters._id) {
          action = getAllCat({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            keywords: filters?._id[0],
          });
        } else {
          action = getAllCat({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
          });
        }
      }
      dispatch(action);
      setPagination({
        ...pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const finishForm = async (data) => {
    setSubmit(true);
      const action = await saveCatBlog({ ...data, _id: valueForm._id }).then(res => message.success("Success",0.5)).catch(err => message.success(err.response.data.message,1));
      setSubmit(false);
    form.current.resetFields();
    setValueForm({
      TenDanhMucBlog: "",
      _id: 0,
    });
    handleReloadData();
    setVisible(false);
   
  };

  useEffect(() => {
    form.current?.setFieldsValue({
      TenDanhMucBlog: valueForm.TenDanhMucBlog,
    });
  }, [valueForm]);

  useEffect(() => {
    const action = getAllCat();
    dispatch(action);
  }, []);

  return (
    <div>
      <Button onClick={handleOpen} style={{ margin: "10px 0px", backgroundColor: "#40a9ff", color: "white" }}>
      {t("categoryBlog.add")}
      </Button>
      <Drawer
        visible={visible}
        placement="right"
        title="CategoryBlog form"
        width={window.innerWidth > 900 ? "25%" : "100%"}
        onClose={handleClose}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>{t("button.cancel")}</Button>
            <Button type="primary" form="formCategoryBlog" htmlType="submit" disabled={submit}>
            {t("button.submit")}
            </Button>
          </Space>
        }
      >
        <Form
          id="formCategoryBlog"
          ref={form}
          name="Form category blog"
          layout="vertical"
          onFinish={finishForm}
        >
          <Form.Item
            label={t && t("categoryBlog.category")}
            name="TenDanhMucBlog"
            rules={[{ required: true, message: (t("categoryBlog.Pleaseinputyourcategoryblog")) }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
      <Table
        columns={column}
        dataSource={[...data]}
        rowKey={(record) => record.MaDanhMucBlog}
        pagination={{...pagination,total: total}}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        loading={loading}
      />
    </div>
  );
}

export default ListCategoryBlog;
