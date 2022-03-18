import "braft-editor/dist/index.css";
import { groupBy } from "lodash";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Drawer,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
  Divider,
} from "antd";
import { formatCurrency, formatPhone } from "app/format";
import { deleteOrd, getAllOrd, saveOrd } from "features/DonHang/orderSlice";
import { getAllCus } from "features/KhachHang/customerSlice";
import { getAll } from "features/Product/productSlice";
import { getAllUs } from "features/User/userSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { removeOrder, saveOrder } from "api/orderApi";

ListOrder.propTypes = {};
function ListOrder(props) {
  const { Option } = Select;
  const { TextArea } = Input;
  const { t } = useTranslation();
  const data = useSelector((state) => state.orders.orders);
  const total = useSelector((state) => state.orders.totalCount);
  const loading = useSelector((state) => state.orders.loading);
  const customers = useSelector((state) => state.customers.customers);
  const users = useSelector((state) => state.users.users);
  const products = useSelector((state) => state.products.products);
  const success = useSelector((state) => state.orders.success);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const { Panel } = Collapse;
  const [submit, setSubmit] = useState(false);
  const [valueForm, setValueForm] = useState({
    _id: 0,
    MaKhachHang: 0,
    DiaChi: "",
    email: "",
    SDT: "",
    items: [
      {
        sanpham: null,
        soluong: 0,
      },
    ],
    MaTaiKhoan: null,
    TrangThai: 0,
    TinhTrangThanhToan: 0,
    KieuThanhToan: "cod",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
  });
  const form = useRef();
  const column = [
    {
      title: "ID ",
      dataIndex: "_id",
      key: "_id",
      width: 80,
      sorter: (a, b) => a._id - b._id,
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            confirm()
          }}
          style={{ marginBottom: 8, display: 'block' }}
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
          <Button size="small" style={{ width: 90 }} onClick={() => clearFilters()}>
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
        return (
          <SearchOutlined />
        )
      }, 
      onFilter: (value, record) => {
        return record._id.toString().toLowerCase().includes(value.toString().toLowerCase())
      }//   filterDropdown: ({
      //     setSelectedKeys,
      //     selectedKeys,
      //     confirm,
      //     clearFilters,
      //   }) => (
      //     <div style={{ padding: 8 }}>
      //       <Input
      //         placeholder={`Search`}
      //         value={selectedKeys[0]}
      //         onChange={(e) =>
      //           setSelectedKeys(e.target.value ? [e.target.value] : [])
      //         }
      //         onPressEnter={() => {
      //           confirm();
      //         }}
      //         style={{ marginBottom: 8, display: "block" }}
      //       />
      //       <Space>
      //         <Button
      //           type="primary"
      //           icon={<SearchOutlined />}
      //           size="small"
      //           style={{ width: 90 }}
      //           onClick={() => confirm()}
      //         >
      //           Search
      //         </Button>
      //         <Button
      //           size="small"
      //           style={{ width: 90 }}
      //           onClick={() => clearFilters()}
      //         >
      //           Reset
      //         </Button>
      //         {/* <Button
      //           type="link"
      //           size="small"
      //           onClick={() => {
      //             confirm({ closeDropdown: false });

      //           }}
      //         >
      //           Filter
      //         </Button> */}
      //       </Space>
      //     </div>
      //   ),
      //   filterIcon: () => {
      //     return <SearchOutlined />;
      //   },
    },
    {
      title: t && t("order.items"),
      dataIndex: "items",
      key: "items",
      width: 200,
      render: (record) => (
        <div>
          {record &&
            record.length &&
            record.map((item, index) => (
              <Space key={index} style={{ marginBottom: "10px" }}>
                <img
                  src={item?.sanpham?.AnhMoTa[0]?.source}
                  style={{ width: "80px" }}
                />
                <Tag>
                  {item?.sanpham?.TenSanPham} * {item?.soluong}
                </Tag>
              </Space>
            ))}
        </div>
      ),
    },
    {
      title: t && t("order.customer"),
      dataIndex: "MaKhachHang",
      key: "MaKhachHang",
      render: (record) => (
        <Tag color="geekblue">{record?.TenKhachHang + " - " + record?._id}</Tag>
      ),
    },
    {
      title: t && t("order.user"),
      dataIndex: "MaTaiKhoan",
      key: "MaTaiKhoan",
      render: (record) => (
        <div>
          {record && (
            <Tag color="geekblue">
              {record?.TenNhanVien + " - " + record?._id}
            </Tag>
          )}
        </div>
      ),
    },

    {
      title: t && t("order.total"),
      dataIndex: "TongTien",
      key: "TongTien",
      render: (record) => (
        <Tag color="processing">{formatCurrency(record)}</Tag>
      ),
    },
    {
      title: t && t("order.phone"),
      dataIndex: "SDT",
      key: "SDT",
      render: (record) => <Tag color="volcano">{formatPhone(record)}</Tag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: t && t("order.address"),
      dataIndex: "DiaChi",
      key: "DiaChi",
    },
    {
      title: t && t("order.created"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (record) => (
        <div>{moment(record).format("HH:mm | DD/MM/YYYY")}</div>
      ),
    },
    {
      title: t && t("order.finishedAt"),
      dataIndex: "NgayHoanThanh",
      key: "NgayHoanThanh",
      render: (record) => (
        <div>{record && moment(record).format("HH:mm | DD/MM/YYYY")}</div>
      ),
    },
    // {
    //   title: "Complete day",
    //   dataIndex: "NgayHoanThanh",
    //   key: "NgayHoanThanh",
    //   render: (record) => (
    //     <div>{moment(record).format("HH:mm | DD/MM/YYYY")}</div>
    //   ),
    // },
    {
      title: t && t("order.status"),
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (record) => (
        <>
          {record == 0 && <Tag color="orange">{t && t("order.incomple")}</Tag>}
          {record == 1 && <Tag color="cyan">{t && t("order.complete")}</Tag>}
        </>
      ),
    },
    {
      title: t && t("order.statusPayment"),
      dataIndex: "TinhTrangThanhToan",
      key: "TinhTrangThanhToan",
      render: (record) => (
        <>
          {record == 0 && <Tag color="red">{t && t("order.unpaid")}</Tag>}
          {record == 1 && <Tag color="cyan">{t && t("order.paid")}</Tag>}
        </>
      ),
    },
    {
      title: t && t("order.paymentMethod"),
      dataIndex: "KieuThanhToan",
      key: "KieuThanhToan",
      render: (record) => <Tag color="green">{record}</Tag>,
    },
    {
      title: t && t("button.action"),
      dataIndex: "",
      key: "x",
      width: 200,
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
      setIsAdd(false);
      console.log(formValue);
      //   const getDataCustomer = await axios.get(`${process.env.REACT_APP_API_URL}khachhangs/${}`)
      setValueForm({
        _id: formValue?._id,
        MaKhachHang: formValue?.MaKhachHang?._id,
        DiaChi: formValue?.MaKhachHang?.DiaChi,
        email: formValue?.MaKhachHang?.email,
        SDT: formValue?.MaKhachHang?.SDT,
        items: formValue?.items.map((p) => ({
          sanpham: p?.sanpham?._id,
          soluong: p?.soluong,
        })),
        MaTaiKhoan:
          formValue?.MaTaiKhoan && formValue?.MaTaiKhoan?._id
            ? formValue.MaTaiKhoan._id
            : null,
        TrangThai: formValue?.TrangThai,
        TinhTrangThanhToan: formValue?.TinhTrangThanhToan,
        KieuThanhToan: formValue?.KieuThanhToan,
      });

    } else {
      setIsAdd(true);
      form.current?.setFieldsValue({
        _id: 0,
        MaKhachHang: 0,
        DiaChi: "",
        email: "",
        SDT: "",
        items: [
          {
            sanpham: null,
            soluong: 1,
          },
        ],
        MaTaiKhoan: null,
        TrangThai: 0,
        TinhTrangThanhToan: 0,
        KieuThanhToan: "cod",
      });
      setValueForm({
        _id: 0,
        MaKhachHang: 0,
        DiaChi: "",
        email: "",
        SDT: "",
        items: [
          {
            sanpham: null,
            soluong: 1,
          },
        ],
        MaTaiKhoan: null,
        TrangThai: 0,
        TinhTrangThanhToan: 0,
        KieuThanhToan: "cod",
      });
    }

    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setValueForm({
      _id: 0,
      MaKhachHang: 0,
      DiaChi: "",
      email: "",
      SDT: "",
      items: [
        {
          sanpham: null,
          soluong: 1,
        },
      ],
      MaTaiKhoan: null,
      TrangThai: 0,
      TinhTrangThanhToan: 0,
      KieuThanhToan: "cod",
    });
    form?.current.resetFields();
  };

  const handleReloadData = async () => {
    const action = getAllOrd();
    await dispatch(action);
  };

  const handleConfirmDelete = async (id) => {
 
      const action = await removeOrder(id)
        .then((res) => message.success("Delete order success", 0.4))
        .catch((err) => {
          message.success(err.response.data.message, 1);
        });
      handleReloadData();
      setPagination({
        current: 1,
        pageSize: 5,
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
        action = getAllOrd({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
          keywords: filters?._id[0],
        });
      } else {
        action = getAllOrd({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
        });
      }
    } else {
      if (filters && filters._id) {
        action = getAllOrd({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          keywords: filters?._id[0],
        });
      } else {
        action = getAllOrd({
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
      const itemsNew = groupBy(data.items, "sanpham");
      const newData = [];
      for (const [item, key] of Object.entries(itemsNew)) {
        console.log(item, key);
        newData.push({
          sanpham: item,
          soluong: key.map((p) => p.soluong).reduce((a, b) => a + b, 0),
        });
      }
      let arrayItems = [];
      if (isAdd) {
        arrayItems = newData.map((p) => ({
          sanpham: {
            _id: p.sanpham,
          },
          soluong: p.soluong,
        }));
      } else {
        arrayItems = newData.map((p) => ({
          sanpham: {
            _id: p.sanpham,
          },
          soluong: p.soluong,
          soluongcu: valueForm.items.find((g) => g.sanpham == p.sanpham)
            ? valueForm.items.find((g) => g.sanpham == g.sanpham).soluong
            : 0,
        }));
      }
      
      if(data.TrangThai == 1 && !isAdd){
        const action = await saveOrder({
          ...data,
          items: arrayItems,
          _id: valueForm._id,
          NgayHoanThanh: new Date()
        })
          .then((res) => {
            setSubmit(false);
            message.success("Success", 0.6);
          })
          .catch((err) => {
            message.error(err.response?.data?.message, 1);
            setSubmit(false);
          });
      }else{
        const action = await saveOrder({
          ...data,
          items: arrayItems,
          _id: valueForm._id,
        })
          .then((res) => {
            setSubmit(false);
            message.success("Success", 0.6);
          })
          .catch((err) => {
            message.error(err.response?.data?.message, 1);
            setSubmit(false);
          });
      }
      form.current.resetFields();
      setValueForm({
        _id: 0,
        MaKhachHang: 0,
        DiaChi: "",
        email: "",
        SDT: "",
        items: [
          {
            sanpham: null,
            soluong: 1,
          },
        ],
        MaTaiKhoan: null,
        TrangThai: 0,
        TinhTrangThanhToan: 0,
        KieuThanhToan: "cod",
      });
      handleReloadData();
      const actionProduct = getAll();
      dispatch(actionProduct);
      setVisible(false);
   
  };

  const getCustomer = (value) => {
    try {
      let timeout;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => {
        const action = getAllCus({
          keywords: value,
          pageNo: 1,
          pageSize: 10,
        });
        dispatch(action);
      }, 300);
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = (value) => {
    let timeout;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      const action = getAllUs({
        keywords: value,
        pageNo: 1,
        pageSize: 10,
      });
      dispatch(action);
    }, 300);
  };



  const getProductFilter = (value) => {
    let timeout;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      const action = getAll({
        keywords: value,
        pageNo: 1,
        pageSize: 10,
      });
      dispatch(action);
    }, 300);
  }
  useEffect(() => {
    if (!isAdd) {
      form.current?.setFieldsValue({
        _id: valueForm?._id,
        MaKhachHang: valueForm?.MaKhachHang,
        DiaChi: valueForm?.DiaChi,
        email: valueForm?.email,
        SDT: valueForm?.SDT,
        MaTaiKhoan: valueForm?.MaTaiKhoan,
        TrangThai: valueForm?.TrangThai,
        TinhTrangThanhToan: valueForm?.TinhTrangThanhToan,
        KieuThanhToan: valueForm?.KieuThanhToan,
        items: valueForm?.items,
      });
    } else {
      form.current?.setFieldsValue({
        _id: valueForm?._id,
        MaKhachHang: valueForm?.MaKhachHang?._id,
        DiaChi: valueForm?.DiaChi,
        email: valueForm?.email,
        SDT: valueForm?.SDT,
        items: [
          {
            sanpham: null,
            soluong: 1,
          },
        ],
        MaTaiKhoan: null,
        TrangThai: 0,
        TinhTrangThanhToan: 0,
        KieuThanhToan: "cod",
      });
    }
  }, [valueForm]);

  useEffect(() => {
    handleReloadData();
    const actionCustomer = getAllCus();
    dispatch(actionCustomer);
    const actionProduct = getAll();
    dispatch(actionProduct);
    const actionUser = getAllUs();
    dispatch(actionUser);
  }, []);
  const onChange = async (value) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}khachhangs/${value}`
    );
    if (res && res.data) {
      form?.current?.setFieldsValue({
        DiaChi: res.data?.DiaChi,
        email: res.data?.email,
        SDT: res.data?.SDT,
      });
    }
  };

  const onChangeProduct = async (value) => {
    const action = getAll();
    dispatch(action);
  };
  return (
    <div>
      <Button
        onClick={handleOpen}
        type="primary"
        style={{ margin: "10px 0px" }}
      >
        {t("order.add")}
      </Button>
      <Drawer
        visible={visible}
        placement="right"
        title="Order form"
        width={window.innerWidth > 900 ? "50%" : "100%"}
        onClose={handleClose}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>{t("button.cancel")}</Button>
            <Button
              type="primary"
              form="formOrder"
              htmlType="submit"
              disabled={submit}
            >
              {t("button.submit")}
            </Button>
          </Space>
        }
      >
        <Form
          id="formOrder"
          ref={form}
          name="Form product"
          onFinish={finishForm}
          layout="vertical"
        >
          <Collapse defaultActiveKey={["1", "2", "3"]}>
            <Panel header={t && t("order.customer")} key="1">
              <Form.Item
                name="MaKhachHang"
                label={t && t("order.selectCus")}
                rules={[
                  { required: true, message: t("order.pleaseSelectCustomer") },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t && t("order.SelectAPerson")}
                  onChange={onChange}
                  onSearch={getCustomer}
                  defaultActiveFirstOption={false}
                  filterOption={false}
                >
                  {customers.map((customer, index) => (
                    <Option key={index} value={customer._id}>
                      {customer.TenKhachHang +
                        " | " +
                        customer.SDT +
                        " | " +
                        customer.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t && t("order.address")}
                name="DiaChi"
                rules={[
                  {
                    required: true,
                    message: t("order.pleaseEnterYourAddress"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: t("order.theInputIsNotValidEmail"),
                  },
                  {
                    required: true,
                    message: t("order.pleaseInputYourEmail"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t && t("order.phone")}
                name="SDT"
                rules={[
                  {
                    pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    message: t("order.phoneNumberNotValid"),
                  },
                  {
                    required: true,
                    message: t("order.enterYourPhoneNumber"),
                  },
                ]}
                validateTrigger="onSubmit"
              >
                <Input />
              </Form.Item>
            </Panel>
            <Panel header={t && t("order.items")} key="2">
              <Form.List
                name="items"
                rules={[
                  {
                    validator: async (_, items) => {
                      if (!items || items.length < 1) {
                        return Promise.reject(new Error("At least 1 product"));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        key={index}
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.sanpham !== curValues.sanpham ||
                          prevValues.soluong !== curValues.soluong
                        }
                      >
                        {() => (
                          <Row
                            style={{ width: "100%" }}
                            align="bottom"
                            gutter="10"
                          >
                            <Divider>
                              {t("order.product") + " " + (index + 1)}
                            </Divider>
                            <Col span="16">
                              <Form.Item
                                {...field}
                                validateTrigger={["onChange", "onBlur"]}
                                name={[field.name, "sanpham"]}
                                fieldKey={[field.fieldKey, "sanpham"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      t("order.pleaseSelectProduct") +
                                      (index + 1),
                                    // message:(t(`order.pleaseSelectProduct ${ index + 1}.))`,
                                    // message: `Please select product ${ index + 1 }`,
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  placeholder={t && t("order.Selectaproduct")}
                                  onChange={onChangeProduct}
                                  onSearch={getProductFilter}
                  defaultActiveFirstOption={false}
                  filterOption={false}
                                >
                                  {products.map((product, index) => (
                                    <Option key={index} value={product._id}>
                                      {product.code +
                                        " | " +
                                        product.TenSanPham +
                                        " | " +
                                        product.SoLuong}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span="8" style={{ display: "flex" }}>
                              <Form.Item
                                {...field}
                                name={[field.name, "soluong"]}
                                fieldKey={[field.fieldKey, "soluong"]}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      t("order.Pleaseinputquantityproduct") +
                                      (index + 1),
                                    // message: `Please input quantity product ${
                                    //   index + 1
                                    // }.`,
                                  },
                                ]}
                              >
                                <InputNumber
                                  placeholder={t && t("order.Quantity")}
                                  style={{ width: "100%" }}
                                  min={1}
                                />
                              </Form.Item>
                              <MinusCircleOutlined
                                style={{
                                  marginTop: "10px",
                                  marginLeft: "10px",
                                }}
                                onClick={() => remove(field.name)}
                              />
                            </Col>
                          </Row>
                        )}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: "100%" }}
                        icon={<PlusOutlined />}
                      >
                        {t && t("product.add")}
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Panel>
            <Panel header={t && t("order.inforOrder")} key="3">
              <Form.Item name="MaTaiKhoan" label={t && t("order.selectUsr")}>
                <Select
                  showSearch
                  placeholder={t && t("order.Selectauser")}
                  onChange={onChange}
                  onSearch={getUser}
                  defaultActiveFirstOption={false}
                  filterOption={false}
                >
                  {users.map((user, index) => (
                    <Option key={index} value={user._id}>
                      {user._id + " | " + user.TenNhanVien}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="TrangThai"
                label={t && t("order.status")}
                rules={[
                  {
                    required: true,
                    message: t("order.Pleaseselectorderstatus"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t && t("order.Selectaorderstatus")}
                >
                  <Option value={0}>{t && t("order.incomple")}</Option>
                  <Option value={1}>{t && t("order.complete")}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="TinhTrangThanhToan"
                label={t && t("order.statusPayment")}
                rules={[
                  {
                    required: true,
                    message: t("order.Pleaseselectpaymentstatus"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t && t("order.Selectapaymentstatus")}
                >
                  <Option value={0}>{t && t("order.unpaid")}</Option>
                  <Option value={1}>{t && t("order.paid")}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="KieuThanhToan"
                label={t && t("order.paymentMethod")}
                rules={[
                  {
                    required: true,
                    message: t("order.Pleaseselectpaymentmethod"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t && t("order.Selectapaymentmethod")}
                >
                  <Option value="cod">Cod</Option>
                  <Option value="momo">Momo</Option>
                </Select>
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Drawer>

      <Table
        columns={column}
        dataSource={data}
        scroll={{ x: 2000 }}
        onChange={handleTableChange}
        pagination={{ ...pagination, total: total }}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
}

export default ListOrder;
