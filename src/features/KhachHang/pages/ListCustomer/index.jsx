import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Drawer,
  Table,
  Form,
  Space,
  Input,
  Select,
  Popconfirm,
  Row,
  Col,
  Switch,
  DatePicker,
  Tag,
  Upload,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomer,
  getAllCus,
  getCusById,
  saveCus,
} from "features/KhachHang/customerSlice";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import axiosClient from "api/axiosClient";
import moment from "moment";
import { formatPhone } from "app/format";
import { useTranslation } from "react-i18next";
import { removeCustomer, saveCustomer } from "api/customer";
import axios from "axios";
ListCustomer.propTypes = {};
function ListCustomer(props) {
  const { t } = useTranslation();
  const { Option } = Select;
  const { TextArea } = Input;
  const data = useSelector((state) => state.customers.customers);
  const total = useSelector((state) => state.customers.totalCount);
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const loading = useSelector((state) => state.customers.loading);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [add, setAdd] = useState(false);
  const [value, setValue] = useState({
    _id: 0,
    source: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
  });
  const [formValue, setValueForm] = useState({
    _id: 0,
    TenKhachHang: "",
    email: "",
    SDT: "",
    DiaChi: {
      provinceOrCity: {
        id: null,
        name: "",
        pid: null,
        code: null,
      },
      district: {
        id: null,
        name: "",
        pid: null,
        code: null,
      },
      ward: {
        id: null,
        name: "",
        pid: null,
        code: null,
      },
      DiaChiDetail: "",
    },
    password: "",
    NgaySinh: null,
    TrangThai: true,
  });
  const form = useRef();
  const column = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
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
      title: t && t("customer.customerName"),
      dataIndex: "TenKhachHang",
      key: "TenKhachHang",
    },
    {
      title: t && t("customer.address"),
      dataIndex: "DiaChi",
      key: "DiaChi",
      render: (record) => <p>{record.DiaChiDetail}</p>
      // className: "hidden",
    },
    {
      title: t && t("customer.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t && t("customer.phoneNumber"),
      dataIndex: "SDT",
      key: "SDT",
      render: (record) => <Tag color="volcano">{formatPhone(record)}</Tag>,
    },
    {
      title: t && t("customer.DOB"),
      dataIndex: "NgaySinh",
      key: "NgaySinh",
      render: (record) => <div>{record && moment(record).format("DD/MM/YYYY")}</div>,
    },
    {
      title: t && t("customer.status"),
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (record) => (
        <>
          {record == true && <Tag color="orange">Active</Tag>}
          {record == false && <Tag color="cyan">InActive</Tag>}
        </>
      ),
    },
    {
      title: t && t("button.action"),
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

  const handleOpen = async (formValue) => {
    if (formValue._id) {
      setAdd(false);
      setValueForm({
        _id: formValue._id,
        TenKhachHang: formValue.TenKhachHang,
        DiaChi: formValue?.DiaChi,
        email: formValue.email,
        SDT: formValue.SDT,
        password: formValue.password,
        NgaySinh: formValue.NgaySinh,
        TrangThai: formValue.TrangThai,
      });
    } else {
      setAdd(true);
      form.current?.setFieldsValue({
        _id: 0,
        TenKhachHang: "",
        DiaChi: {
          provinceOrCity: null,
          district: null,
          ward: null,
          DiaChiDetail: "",
        },
        email: "",
        SDT: "",
        password: "",
        NgaySinh: null,
        TrangThai: true,
      });
      setValueForm({
        _id: 0,
        TenKhachHang: "",
        DiaChi: {
          provinceOrCity: {
            id: null,
            name: "",
            pid: null,
            code: null,
          },
          district: {
            id: null,
            name: "",
            pid: null,
            code: null,
          },
          ward: {
            id: null,
            name: "",
            pid: null,
            code: null,
          },
          DiaChiDetail: "",

        },
        email: "",
        SDT: "",
        password: "",
        NgaySinh: null,
        TrangThai: true,
      });
    }
    setVisible(true);
    if (formValue._id) {
      const cities = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/vnlocations/0`
      );
      setCities(cities.data);
      const districts = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${formValue?.DiaChi?.district?.pid}`
      );
      setDistricts(districts.data);
      const wards = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${formValue?.DiaChi?.ward?.pid}`
      );
      setWards(wards.data);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setValueForm({
      _id: 0,
      TenKhachHang: "",
      DiaChi: {
        provinceOrCity: {
          id: null,
          name: "",
          pid: null,
          code: null,
        },
        district: {
          id: null,
          name: "",
          pid: null,
          code: null,
        },
        ward: {
          id: null,
          name: "",
          pid: null,
          code: null,
        },
        DiaChiDetail: "",

      },
      email: "",
      SDT: "",
      password: "",
      NgaySinh: null,
      TrangThai: true,
    });
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
        if (filters && filters._id) {
          action = getAllCus({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            sort: sort,
            keywords: filters?._id[0],
          });
        } else {
          action = getAllCus({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            sort: sort,
          });
        }
      } else {
        if (filters && filters._id) {
          action = getAllCus({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            keywords: filters?._id[0],
          });
        } else {
          action = getAllCus({
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

  const handleReloadData = () => {
    const action = getAllCus();
    dispatch(action);
  };

  const handleConfirmDelete = async (id) => {
   
      const action = await removeCustomer(id)
        .then((res) => message.success("Delete customer success", 0.4))
        .catch((err) => {
          
          if(err && err.response && err.response.data &&  err.response.data.message){
            if(err.response.data.message.message) message.error(err.response.data.message.message,1)
            else message.error(err.response.data.message,1)
          }
        });
      handleReloadData();
  
  };
  const formatAddress = (data) => {
    return {
      id: data?.id ? data.id : null,
      name: data?.name ? data.name : null,
      pid: data?.pid ? data.pid : null,
      code: data?.id ? data.id : null,
    };
  };
  const finishForm = async (data) => {
    setSubmit(true);
    console.log(data)
    const city = formatAddress(
      cities.find((p) => p.id == data.DiaChi.provinceOrCity)
    );
    const district = formatAddress(
      districts.find((p) => p.id == data.DiaChi.district)
    );
    const ward = formatAddress(
      wards.find((p) => p.id == data.DiaChi.ward)
    );
    data.DiaChi = {
      ...data.DiaChi,
      provinceOrCity: city,
      district: district,
      ward: ward,
    };
      if (data.password.match(/^\s*$/)) {
        const action = await saveCustomer({
          ...data,
          _id: formValue._id,
          password: formValue.password,
        })
          .then((res) => {
            message.success("Success", 0.5);
          })
          .catch((err) => {
            message.error("Có lỗi xảy ra",1);
          });
      } else {
        const action = await saveCustomer({ ...data, _id: formValue._id })
          .then((res) => {
            message.success("Success", 0.5);
          })
          .catch((err) => {
            message.error("Có lỗi xảy ra",1);
          });
      }
      setSubmit(false);

      form.current.resetFields();
      setValueForm({
        _id: 0,
      });
      handleReloadData();
      setVisible(false);
   
  };
  const getCities = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/0`
    );
    console.log(res.data, " res");
    setCities(res.data);
  };
  const onChangeCity = async (value) => {
    const DiaChi = form?.current?.getFieldValue("DiaChi");
    form?.current?.setFieldsValue({
      DiaChi: { ...DiaChi, district: null, ward: null },
    });
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${value}`
    );
    setDistricts(res.data);
  };
  const onChangeDistrict = async (value) => {
    const DiaChi = form?.current?.getFieldValue("DiaChi");
    form?.current?.setFieldsValue({
      DiaChi: { ...DiaChi, ward: null },
    });
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${value}`
    );
    setWards(res.data);
  };
  useEffect(() => {
    if (!add) {
      form.current?.setFieldsValue({
        _id: formValue._id,
        TenKhachHang: formValue.TenKhachHang,
        email: formValue.email,
        SDT: formValue.SDT,
        password: "",
        NgaySinh: formValue.NgaySinh && moment(formValue.NgaySinh),
        TrangThai: formValue.TrangThai,
        DiaChi: {
          provinceOrCity: formValue?.DiaChi?.provinceOrCity?.id,
          district: formValue?.DiaChi?.district?.id,
          ward: formValue?.DiaChi?.ward?.id,
          DiaChiDetail: formValue.DiaChi?.DiaChiDetail,

        },
      });
    } else {
      form.current?.setFieldsValue({
        _id: formValue?._id,
        TrangThai: true,
        DiaChi: {
          provinceOrCity: null,
          district: null,
          ward: null,
          DiaChiDetail: ""
        },
      });
    }
  }, [formValue]);

  useEffect(() => {
    handleReloadData();
    getCities();
  }, []);

  return (
    <div>
      <Button
        onClick={handleOpen}
        style={{
          margin: "10px 0px",
          backgroundColor: "#40a9ff",
          color: "white",
        }}
      >
        {t("customer.add")}
      </Button>
      <Drawer
        visible={visible}
        placement="right"
        title={t("customer.customerForm")}
        width={window.innerWidth > 900 ? "25%" : "100%"}
        onClose={handleClose}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>{t("button.cancel")}</Button>
            <Button type="primary" form="formCustomer" htmlType="submit" disabled={submit}>
              {t("button.submit")}
            </Button>
          </Space>
        }
      >
        <Form
          id="formCustomer"
          ref={form}
          name="Form customer"
          layout="vertical"
          onFinish={finishForm}
        >
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item
                label={t && t("customer.customerName")}
                name="TenKhachHang"
                rules={[
                  {
                    required: true,
                    message: t && t("customer.pleaseEnterCustomerName"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t && t("customer.address")}
                name={["DiaChi", "DiaChiDetail"]}
                rules={[
                  {
                    required: true,
                    message: t && t("customer.pleaseEnterCustomerAddress"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Row
                style={{ width: "100%", justifyContent: "space-between" }}
                gutter="10"
              >
                <Col span={8}>
                  <Form.Item
                    name={["DiaChi", "provinceOrCity"]}
                    label={t && t("shippingAddress.city")}
                    rules={[
                      {
                        required: true,
                        message: t && t("shippingAddress.pleaseSelectCity"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t && t("shippingAddress.selectCity")}
                      onChange={onChangeCity}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                    >
                      {cities.map((city, index) => (
                        <Option key={index} value={city?.id}>
                          {city?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["DiaChi", "district"]}
                    label={t && t("shippingAddress.district")}

                    rules={[
                      {
                        required: true,
                        message: t && t("shippingAddress.pleaseSelectDistrict"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t && t("shippingAddress.selectDistrict")}
                      onChange={onChangeDistrict}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                    >
                      {districts.map((district, index) => (
                        <Option key={index} value={district?.id}>
                          {district?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["DiaChi", "ward"]}
                    label={t && t("shippingAddress.ward")}

                    rules={[
                      {
                        required: true,
                        message: t && t("shippingAddress.pleaseSelectWard"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t && t("shippingAddress.selectWard")}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                    >
                      {wards.map((ward, index) => (
                        <Option key={index} value={ward?.id}>
                          {ward?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label={t && t("customer.email")}
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Email not valid",
                  },
                  {
                    required: true,
                    message: t && t("customer.pleaseEnterCustomerEmail"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t && t("customer.password")}
                name="password"
                rules={[
                  {
                    required: add,
                    message: t && t("customer.pleaseEnterCustomerPassword"),
                  },
                  { min: 6, message: 'Password must be minimum 6 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t && t("customer.DOB")}
                name="NgaySinh"
                // rules={[
                //   {
                //     required: true,
                //     message: t && t("customer.pleaseChooseDOB"),
                //   },
                // ]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                label={t && t("customer.status")}
                name="TrangThai"
                valuePropName="checked"
              >
                <Switch
                  defaultValue="Active"
                  checkedChildren="Active"
                  unCheckedChildren="InActive"
                />
              </Form.Item>
              <Form.Item
                label={t && t("customer.phoneNumber")}
                name="SDT"
                rules={[
                  {
                    pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    message: "Phone number not valid",
                  },
                  {
                    required: true,
                    message: t && t("customer.pleaseEnterCustomerPhoneNumber"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Table
        columns={column}
        dataSource={[...data]}
        pagination={{ ...pagination, total: total }}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1400 }}
      />
    </div>
  );
}

export default ListCustomer;
