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
  Switch,
  DatePicker,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllDis } from "features/Discount/discountSlice";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";
import AddEdit from "../AddEdit";
import { removeDiscount, saveDiscount } from "api/discountApi";
ListDiscount.propTypes = {};

function ListDiscount(props) {
  const { t } = useTranslation();
  const data = useSelector((state) => state.discounts.discounts);
  const total = useSelector((state) => state.discounts.totalCount);
  const loading = useSelector((state) => state.discounts.loading);

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [valueForm, setValueForm] = useState({
    code: "",
    discount: 0,
    startDate: null,
    endDate: null,
    active: false,
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
      title: t && t("discount.code"),
      dataIndex: "code",
      sorter: (a, b) => a.code - b.code,
    },
    {
      title: t && t("discount.discount"),
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: t && t("discount.startDate"),
      dataIndex: "startDate",
      sorter: true,
      render: (record) => (
        <div>{record && moment(record).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      title: t && t("discount.endDate"),
      dataIndex: "endDate",
      sorter: true,
      render: (record) => (
        <div>{record && moment(record).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      title: t && t("discount.active"),
      dataIndex: "active",
      sorter: true,
      render: (record) => (
        <div>{record ? "Đã kích hoạt" : "Chưa kích hoạt"}</div>
      ),
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
      code: "",
      discount: 0,
      startDate: null,
      endDate: null,
      active: false,
      _id: 0,
    });
    setVisible(false);
  };

  const handleConfirmDelete = async (id) => {
    const action = await removeDiscount(id)
      .then((res) => message.success("Delete discount success", 0.4))
      .catch((err) => message.error(err.response.data.message, 0.4));
    handleReloadData();
  };
  const handleReloadData = () => {
    const action = getAllDis();
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
      if (filters && filters._id && filters._id.length) {
        action = getAllDis({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
          keywords: filters?._id[0],
        });
      } else {
        action = getAllDis({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
        });
      }
    } else {
      if (filters && filters._id && filters._id.length) {
        action = getAllDis({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          keywords: filters?._id[0],
        });
      } else {
        action = getAllDis({
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

    const action = await saveDiscount({ ...data, _id: valueForm._id })
      .then((res) => message.success("Success", 0.5))
      .catch((err) => message.error(err.response.data.message, 1));

    form.current.resetFields();
    setValueForm({
      code: "",
      discount: 0,
      startDate: null,
      endDate: null,
      active: false,
      _id: 0,
    });
    handleReloadData();
    setSubmit(false);
    setVisible(false);
  };

  useEffect(() => {
    form.current?.setFieldsValue({
      code: valueForm?.code,
      discount: valueForm?.discount,
      startDate: valueForm.startDate && moment(valueForm.startDate),
      endDate: valueForm.endDate && moment(valueForm.endDate),
      active: valueForm?.active,
    });
  }, [valueForm]);

  useEffect(() => {
    const action = getAllDis();
    dispatch(action);
  }, []);

  return (
    <div>
      <Button
        onClick={handleOpen}
        style={{ margin: "10px 0px" }}
        type="primary"
      >
        {t("discount.add")}
      </Button>
      <Drawer
        visible={visible}
        placement="right"
        title="Discount form"
        width={window.innerWidth > 900 ? "30%" : "100%"}
        onClose={handleClose}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>{t("button.cancel")}</Button>
            <Button
              type="primary"
              form="formDiscount"
              htmlType="submit"
              disabled={submit}
            >
              {t("button.submit")}
            </Button>
          </Space>
        }
      >
        <Form
          id="formDiscount"
          ref={form}
          name="Form discount"
          layout="vertical"
          onFinish={finishForm}
        >
          <Form.Item
            label={t && t("discount.code")}
            name="code"
            rules={[
              {
                required: true,
                message: t("discount.code"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t && t("discount.discount")}
            name="discount"
            rules={[
              {
                required: true,
                message: t("discount.Pleaseenteryourdiscount"),
                type: "number",
                min: 0,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label={t && t("discount.startDate")}
            name="startDate"
            rules={[
              {
                required: true,
                message: t("discount.Pleaseenteryourstartdate"),
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={t && t("discount.endDate")}
            name="endDate"
            rules={[
              {
                required: true,
                message: t("discount.Pleaseenteryourenddate"),
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label={t && t("discount.active")}
            name="active"
            valuePropName="checked"
          >
            <Switch
              defaultValue="Active"
              checkedChildren="Active"
              unCheckedChildren="InActive"
            />
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

export default ListDiscount;
