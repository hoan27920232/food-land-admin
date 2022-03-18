import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  Popconfirm,
  Button,
  Drawer,
  Space,
  Form,
  Input,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCat,
  getAllCategory,
  saveCat,
} from "features/CategoryProduct/categoryProductSlice";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import AddEdit from "../AddEdit";
import { removeCatProduct, saveCatProduct } from "api/categoryProduct";
ListCategoryProduct.propTypes = {};

function ListCategoryProduct(props) {
  const { t } = useTranslation();
  const data = useSelector((state) => state.categoryProducts.danhmucsp);
  const total = useSelector((state) => state.categoryProducts.totalCount);
  const loading = useSelector((state) => state.categoryProducts.loading);

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [valueForm, setValueForm] = useState({
    TenDanhMucSP: "",
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
      key: "_id",
      sorter: (a, b) => a._id - b._id,
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
      title: t("categoryProduct.category"),
      dataIndex: "TenDanhMucSP",
      sorter: (a, b) => a.TenDanhMucSP - b.TenDanhMucSP,
    },
    {
      title: t("button.action"),
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
      TenDanhMucSP: "",
      _id: 0,
    });
    setVisible(false);
  };

  const handleConfirmDelete = async (id) => {
    const action = await removeCatProduct(id)
      .then((res) => message.success("Delete category success", 0.4))
      .catch((err) => message.error(err.response.data.message, 0.4));
    handleReloadData();
  };
  const handleReloadData = () => {
    const action = getAllCategory();
    dispatch(action);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    let sort = "";
    console.log(filters);
    if (sorter) {
      sort += sorter.order == "ascend" ? "" : "-";
    }
    sort += sorter.field ? sorter.field : "_id";
    let action;
    if (sort != "") {
      if (filters && filters._id &&  filters._id.length) {
        action = getAllCategory({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
          keywords: filters?._id[0],
        });
      } else {
        action = getAllCategory({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
        });
      }
    } else {
      if (filters && filters._id && filters._id.length) {
        action = getAllCategory({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          keywords: filters?._id[0],
        });
      } else {
        action = getAllCategory({
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
  };

  const finishForm = async (data) => {
    setSubmit(true);

    const action = await saveCatProduct({ ...data, _id: valueForm._id })
      .then((res) => message.success("Success", 0.5))
      .catch((err) => message.error(err.response.data.message, 1));
      

    form.current.resetFields();
    setValueForm({
      TenDanhMucSP: "",
      _id: 0,
    });
    handleReloadData();
    setSubmit(false);
    setVisible(false);
  };

  useEffect(() => {
    form.current?.setFieldsValue({
      TenDanhMucSP: valueForm.TenDanhMucSP,
    });
  }, [valueForm]);

  useEffect(() => {
    const action = getAllCategory();
    dispatch(action);
  }, []);

  return (
    <div>
      <Button onClick={handleOpen} style={{ margin: "10px 0px" }} type="primary">
        {t("categoryProduct.add")}
      </Button>
      <Drawer
        visible={visible}
        placement="right"
        title="Category form"
        width={window.innerWidth > 900 ? "50%" : "100%"}
        onClose={handleClose}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>{t("button.cancel")}</Button>
            <Button type="primary" form="formCategory" htmlType="submit" disabled={submit}>
              {t("button.submit")}
            </Button>
          </Space>
        }
      >
        <Form
          id="formCategory"
          ref={form}
          name="Form category product"
          layout="vertical"
          onFinish={finishForm}
        >
          <Form.Item
            label={t("categoryProduct.category")}
            name="TenDanhMucSP"
            rules={[
              {
                required: true,
                message: t("categoryProduct.Pleaseinputyourcategory"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
      <Table
        columns={column}
        dataSource={[...data]}
        rowKey={(record) => record._id}
        pagination={{ ...pagination, total: total }}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1500, y: 300 }}
      />
    </div>
  );
}

export default ListCategoryProduct;
