import "braft-editor/dist/index.css";
import { groupBy } from "lodash";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
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
import { getAllDis } from "features/Discount/discountSlice";
import { getAll } from "features/Product/productSlice";
import { getAllUs } from "features/User/userSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { removeOrder, saveOrder, postOrderGHTK, deleteGHTK } from "api/orderApi";
import ReactExport from "react-export-excel";
import { useReactToPrint } from "react-to-print";
import ReactToPrint from "react-to-print";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
ListOrder.propTypes = {};
function ListOrder(props) {
  const { Option } = Select;
  const { TextArea } = Input;
  const componentRef = useRef();
  const { t } = useTranslation();
  const data = useSelector((state) => state.orders.orders);
  const total = useSelector((state) => state.orders.totalCount);
  const loading = useSelector((state) => state.orders.loading);
  const customers = useSelector((state) => state.customers.customers);
  const discounts = useSelector((state) => state.discounts.discounts);
  const users = useSelector((state) => state.users.users);
  const products = useSelector((state) => state.products.products);
  const success = useSelector((state) => state.orders.success);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [print, setPrint] = useState({});
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const { Panel } = Collapse;
  const [submit, setSubmit] = useState(false);
  const [rowSelect, setRowSelect] = useState([]);
  const [valueForm, setValueForm] = useState({
    _id: 0,
    MaKhachHang: 0,
    Discount: null,
    DiaChi: "",
    email: "",
    SDT: "",
    shipMoney: 0,
    items: [
      {
        sanpham: null,
        soluong: 0,
      },
    ],
    MaTaiKhoan: null,
    shippingAddress: {
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
    },
    TrangThai: 0,
    TinhTrangThanhToan: 0,
    KieuThanhToan: "cod",
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
  });
  const form = useRef();
  const column = [
    {
      title: t && t("button.action"),
      dataIndex: "",
      key: "x",
      width: 250,
      render: (record) => (
        <div>
          <Button type="link" onClick={() => handleOpen(record)}>
            {t("button.edit")}
          </Button>
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => handleConfirmDelete(record._id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="link" danger>
              {t("button.delete")}
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => {
              console.log(record);
              setPrint(record);
              setTimeout(() => {
                handlePrint();
              }, 500);
            }}
          >
            Print Bill
          </Button>
        </div>
      ),
    },
    {
      title: "ID ",
      dataIndex: "_id",
      key: "_id",
      width: 80,
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
      onFilter: (value, record) => {
        return record._id
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      }, //   filterDropdown: ({
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
      title: t && t("order.discount"),
      dataIndex: "Discount",
      key: "Discount",
      render: (record) => (
        <div>
          {record && (
            <Tag color="geekblue">
              {record?.code + " - " + record?.discount}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Ship money",
      dataIndex: "shipMoney",
      key: "shipMoney",
      render: (record) => (
        <Tag color="processing">{formatCurrency(record)}</Tag>
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
      title: "Shipping address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      className: "hidden",
    },
  ];
  const handleOpen = async (formValue) => {
    if (formValue._id) {
      setIsAdd(false);
      //   const getDataCustomer = await axios.get(`${process.env.REACT_APP_API_URL}khachhangs/${}`)
      setValueForm({
        _id: formValue?._id,
        MaKhachHang: formValue?.MaKhachHang?._id,
        DiaChi: formValue?.MaKhachHang?.DiaChi,
        email: formValue?.MaKhachHang?.email,
        SDT: formValue?.MaKhachHang?.SDT,
        Discount: formValue?.Discount?._id,
        shipMoney: formValue?.shipMoney,
        shippingAddress: formValue?.shippingAddress,
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
        Discount: 0,
        DiaChi: "",
        email: "",
        SDT: "",
        shipMoney: 0,
        items: [
          {
            sanpham: null,
            soluong: 1,
          },
        ],
        MaTaiKhoan: null,
        shippingAddress: {
          provinceOrCity: null,
          district: null,
          ward: null,
        },
        TrangThai: 0,
        TinhTrangThanhToan: 0,
        KieuThanhToan: "cod",
      });
      setValueForm({
        _id: 0,
        MaKhachHang: 0,
        Discount: 0,
        DiaChi: "",
        shipMoney: 0,
        email: "",
        SDT: "",
        shippingAddress: {
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
        },
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

    if (formValue._id) {
      const cities = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/vnlocations/0`
      );
      setCities(cities.data);
      const districts = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${formValue.shippingAddress.district.pid}`
      );
      setDistricts(districts.data);
      const wards = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${formValue.shippingAddress.ward.pid}`
      );
      setWards(wards.data);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setCities([]);
    setDistricts([]);
    setWards([]);
    setValueForm({
      _id: 0,
      MaKhachHang: 0,
      Discount: 0,
      DiaChi: "",
      email: "",
      SDT: "",
      shipMoney: 0,
      shippingAddress: {
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
      },
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
        message.error(err.response.data.message, 1);
      });
    const action2 = await deleteGHTK(id)
      .then((res) => message.success("Delete order success from GHTK", 0.4))
      .catch((err) => {
        console.log(err)
        message.error("Có lỗi khi xóa đơn hàng từ GHTK", 1);
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
    const city = formatAddress(
      cities.find((p) => p.id == data.shippingAddress.provinceOrCity)
    );
    const district = formatAddress(
      districts.find((p) => p.id == data.shippingAddress.district)
    );
    const ward = formatAddress(
      wards.find((p) => p.id == data.shippingAddress.ward)
    );
    data.shippingAddress = {
      ...data.shippingAddress,
      provinceOrCity: city,
      district: district,
      ward: ward,
    };
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

    if (data.TrangThai == 1 && !isAdd) {
      const action = await saveOrder({
        ...data,
        items: arrayItems,
        _id: valueForm._id,
        NgayHoanThanh: new Date(),
      })
        .then((res) => {
          setSubmit(false);
          message.success("Success", 0.6);
        })
        .catch((err) => {
          message.error(err.response?.data?.message, 1);
          setSubmit(false);
        });
    } else {
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
      shipMoney: 0,
      shippingAddress: {
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
      },
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
  };

  const getCities = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/0`
    );
    console.log(res.data, " res");
    setCities(res.data);
  };
  const onChangeCity = async (value) => {
    const shippingAddress = form?.current?.getFieldValue("shippingAddress");
    form?.current?.setFieldsValue({
      shippingAddress: { ...shippingAddress, district: null, ward: null },
    });
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${value}`
    );
    setDistricts(res.data);
  };
  const onChangeDistrict = async (value) => {
    const shippingAddress = form?.current?.getFieldValue("shippingAddress");
    form?.current?.setFieldsValue({
      shippingAddress: { ...shippingAddress, ward: null },
    });
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${value}`
    );
    setWards(res.data);
  };
  const onChangeWard = async (value) => {
    calculateShip();
  };
  useEffect(() => {
    if (!isAdd) {
      console.log(valueForm, "Hello");
      form.current?.setFieldsValue({
        _id: valueForm?._id,
        MaKhachHang: valueForm?.MaKhachHang,
        Discount: valueForm?.Discount,
        DiaChi: valueForm?.DiaChi,
        email: valueForm?.email,
        SDT: valueForm?.SDT,
        shipMoney: valueForm?.shipMoney,
        MaTaiKhoan: valueForm?.MaTaiKhoan,
        TrangThai: valueForm?.TrangThai,
        TinhTrangThanhToan: valueForm?.TinhTrangThanhToan,
        KieuThanhToan: valueForm?.KieuThanhToan,
        items: valueForm?.items,
        shippingAddress: {
          provinceOrCity: valueForm?.shippingAddress?.provinceOrCity?.id,
          district: valueForm?.shippingAddress?.district?.id,
          ward: valueForm?.shippingAddress?.ward?.id,
        },
      });
      // form.current?.setFieldsValue(
      //   `shippingAddress.provinceOrCity`,
      //   valueForm?.shippingAddress?.provinceOrCity?.id
      // );
      // form.current?.setFieldsValue(
      //   ``,
      //   valueForm?.shippingAddress?.district?.id
      // );
      // form.current?.setFieldsValue(
      //   `shippingAddress.ward`,
      //   valueForm?.shippingAddress?.ward?.id
      // );
    } else {
      form.current?.setFieldsValue({
        _id: valueForm?._id,
        MaKhachHang: valueForm?.MaKhachHang?._id,
        Discount: valueForm?.Discount?._id,
        // DiaChi: valueForm?.DiaChi,
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
        shipMoney: 0,
        KieuThanhToan: "cod",
        shippingAddress: {
          provinceOrCity: null,
          district: null,
          ward: null,
        },
      });
      // form.current?.setFieldsValue(
      //   `shippingAddress.provinceOrCity`,
      //   null
      // );
      // form.current?.setFieldsValue(
      //   `shippingAddress.district`,
      //   null
      // );
      // form.current?.setFieldsValue(
      //   `shippingAddress.ward`,
      //   null
      // );
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
    dispatch(actionProduct);
    const actionDis = getAllDis();
    dispatch(actionDis);
    getCities();
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
        shippingAddress: {
          provinceOrCity:  res.data?.shippingAddress?.provinceOrCity?.id,
          district: res.data?.shippingAddress?.district?.id,
          ward: res.data?.shippingAddress?.ward?.id,
        },
      });
    }
    const cities = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/0`
    );
    setCities(cities.data);
    const districts = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${res.data.shippingAddress.district.pid}`
    );
    setDistricts(districts.data);
    const wards = await axios.get(
      `${process.env.REACT_APP_API_URL}ghtk/vnlocations/${res.data.shippingAddress.ward.pid}`
    );
    setWards(wards.data);
  };
  const onChangeProduct = async (value) => {
    const action = getAll();
    dispatch(action);
  };
  const calculateShip = async () => {
    const shippingAddress = form?.current?.getFieldValue("shippingAddress");
    let items = form?.current?.getFieldValue("items");
    items = items.filter((p) => p.sanpham && p.soluong);
    console.log(shippingAddress);
    let fullItems = [];
    let weight = 0;
    const city = formatAddress(
      cities.find((p) => p.id == shippingAddress.provinceOrCity)
    );
    const district = formatAddress(
      districts.find((p) => p.id == shippingAddress.district)
    );
    if (items.length > 0) {
      fullItems = await axios.get(
        `${process.env.REACT_APP_API_URL}sanphams?_id=${items
          .map((p) => p.sanpham)
          .join(",")}`
      );
      for (let i = 0; i < fullItems.data.result.data.length; i++) {
        console.log(
          fullItems.data.result.data[i].KhoiLuong,
          items.find((p) => p.sanpham == fullItems.data.result.data[i]._id)
            ?.soluong
        );
        weight +=
          fullItems.data.result.data[i].KhoiLuong *
          items.find((p) => p.sanpham == fullItems.data.result.data[i]._id)
            ?.soluong;
      }
    }
    if (
      items.length &&
      shippingAddress.provinceOrCity &&
      shippingAddress.district &&
      shippingAddress.ward
    ) {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}ghtk/calculateShip`,
        {
          params: {
            province: city.name,
            district: district.name,
            weight: weight,
          },
        }
      );
      form?.current?.setFieldsValue({
        shipMoney: res.data?.ship?.fee?.fee,
      });
    }
  };
  const sendGHTK = async () => {
    let flagStatus = "";
    if (rowSelect.length > 0) {
      let orders = await axios.get(
        `${process.env.REACT_APP_API_URL}donhangs?_id=${rowSelect.join(",")}`
      );
      orders = orders.data.result.data;
      for (let index = 0; index < orders.length; index++) {
        if (
          !orders[index]?.MaKhachHang?.TenKhachHang ||
          !orders[index]?.SDT ||
          !orders[index]?.DiaChi ||
          !orders[index]?.shippingAddress?.provinceOrCity?.name ||
          !orders[index]?.shippingAddress?.district?.name ||
          !orders[index]?.shippingAddress?.ward?.name
        ) {
          console.log(orders[index], "order");
          flagStatus = "warn";
          message.error(
            `Đơn hàng ${parseInt(index) + 1} thiếu thông tin người nhận`
          );
        } else if (!orders[index].shipMoney) {
          flagStatus = "warn";
          message.error(
            `Đơn hàng ${parseInt(index) + 1} chưa tính được phí ship`
          );
        }
      }
      if (!flagStatus) {
        for (const index in orders) {
          // Get full data for order
          const orderFullInfo = {
            products: [],
            order: {},
          };
          for (const item of orders[index].items) {
            console.log(item.sanpham, item.sanpham.KhoiLuong);
            orderFullInfo.products.push({
              name: item.sanpham.TenSanPham,
              weight: item.sanpham.KhoiLuong,
              quantity: item.soluong,
            });
          }
          orderFullInfo.order = {
            id: orders[index]._id.toString(),
            pick_money: orders[index].TongTien,
            use_return_address: 0,
            name: orders[index]?.MaKhachHang?.TenKhachHang,
            tel: orders[index]?.SDT,
            address: orders[index].DiaChi,
            province: orders[index]?.shippingAddress?.provinceOrCity?.name,
            district: orders[index]?.shippingAddress?.district?.name,
            ward: orders[index]?.shippingAddress?.ward?.name,
            hamlet: "Khác",
            // is_freeship: orders[index].isFreeship,
            value: orders[index].TongTien,
            deliver_option: "none",
          };
          // Post order to GHTK
          await postOrderGHTK(orderFullInfo)
            .then((res) => {
              if (res.success === false) {
                message.error({
                  duration: 5,
                  content: `Đăng đơn hàng ${
                    parseInt(index) + 1
                  } không thành công. ${res.message}`,
                });
              } else {
                message.success(
                  `Đăng đơn hàng ${parseInt(index) + 1} thành công`
                );
              }
            })
            .catch((err) => {
              message.error(`Đăng đơn hàng ${parseInt(index) + 1} xảy ra lỗi`);
              console.log("Has an error while post order GHTK: ", err);
            });
        }
      }
    }
  };
  const seletedChange = (selected) => {
    setRowSelect(selected);
  };
  return (
    <div>
      {loadingProgress && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
            position: "fixed",
            top: "0px",
            left: "0px",
            zIndex: 1000,
            background: "gray",
            opacity: 0.5,
          }}
        >
          <i class="fas fa-sync fa-spin"></i>
          <p>Đang tính tiền ship</p>
        </div>
      )}
      <Button
        onClick={handleOpen}
        type="primary"
        style={{ margin: "10px 0px" }}
      >
        {t("order.add")}
      </Button>
      <Button
        onClick={() => sendGHTK()}
        type="primary"
        style={{ margin: "10px 0px 10px 10px" }}
      >
        Đăng đơn hàng tiết kiệm
      </Button>
 
      <ExcelFile
        element={
          <Button type="primary" style={{ margin: "10px 10px" }}>
            Export excel
          </Button>
        }
      >
        <ExcelSheet
          data={data.map((p) => ({
            _id: p._id,
            total: p.TongTien,
            items: p.items
              .map((c) => c.sanpham.TenSanPham + " * " + c.soluong)
              .reduce((a, b) => a + "," + b),
          }))}
          name="Orders"
        >
          <ExcelColumn label="ID" value="_id" />
          <ExcelColumn label="Total" value="total" />
          <ExcelColumn
            label="Items"
            value="items"
            style={{ alignment: { wrapText: true } }}
          />
        </ExcelSheet>
      </ExcelFile>
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
              <Row
                style={{ width: "100%", justifyContent: "space-between" }}
                gutter="10"
              >
                <Col span={8}>
                  <Form.Item
                    name={["shippingAddress", "provinceOrCity"]}
                    label="Tỉnh"
                    rules={[
                      {
                        required: true,
                        message: t("order.pleaseSelectCustomer"),
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn tỉnh thành"
                      onChange={onChangeCity}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      disabled={!isAdd}
                    >
                      {cities.map((city, index) => (
                        <Option key={index} value={city?.id}>
                          {city?.id + " | " + city?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["shippingAddress", "district"]}
                    label="Quận"
                    rules={[
                      {
                        required: true,
                        message: t("order.pleaseSelectCustomer"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t && t("order.Selectauser")}
                      onChange={onChangeDistrict}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      disabled={!isAdd}
                    >
                      {districts.map((district, index) => (
                        <Option key={index} value={district?.id}>
                          {district?.id + " | " + district?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["shippingAddress", "ward"]}
                    label="Xã"
                    rules={[
                      {
                        required: true,
                        message: t("order.pleaseSelectCustomer"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t && t("order.Selectauser")}
                      defaultActiveFirstOption={false}
                      onChange={onChangeWard}
                      filterOption={false}
                      disabled={!isAdd}
                    >
                      {wards.map((ward, index) => (
                        <Option key={index} value={ward?.id}>
                          {ward?.id + " | " + ward?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Ship money"
                name="shipMoney"
                rules={[
                  {
                    required: true,
                    message: t("order.enterYourPhoneNumber"),
                  },
                ]}
                validateTrigger="onSubmit"
              >
                <Input disabled />
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
                                  onChange={() => {
                                    onChangeProduct();
                                    calculateShip();
                                  }}
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
                                  onChange={() => calculateShip()}
                                />
                              </Form.Item>
                              <MinusCircleOutlined
                                style={{
                                  marginTop: "10px",
                                  marginLeft: "10px",
                                }}
                                onClick={() => {
                                  remove(field.name);
                                  calculateShip();
                                }}
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
              <Form.Item name="Discount" label={t && t("order.discount")}>
                <Select
                  showSearch
                  placeholder={t && t("order.Selectauser")}
                  onChange={onChange}
                  onSearch={getUser}
                  defaultActiveFirstOption={false}
                  filterOption={false}
                >
                  {discounts.map((discount, index) => (
                    <Option key={index} value={discount?._id}>
                      {discount?._id + " | " + discount?.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
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
        scroll={{ x: 2500 }}
        onChange={handleTableChange}
        pagination={{ ...pagination, total: total }}
        loading={loading}
        rowKey="_id"
        rowSelection={{
          type: "checkbox",
          onChange: seletedChange,
        }}
      />
      <div style={{ display: "none" }}>
        <div class="invoice-box" ref={componentRef} style={{ width: "100%" }}>
          <table cellPadding="0" cellSpacing="0">
            <tr class="top">
              <td colSpan="3">
                <table>
                  <tr>
                    <td class="title">
                      <img
                        src="https://opencart.mahardhi.com/MT04/vegelite/image/catalog/logo.png"
                        style={{ width: "auto", objectFit: "fill" }}
                      />
                    </td>

                    <td>
                      Invoice #: {print._id}
                      <br />
                      Created:{" "}
                      {moment(print.createdAt).format("HH:mm | DD/MM/YYYY")}
                      <br />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="information">
              <td colSpan="3">
                <table>
                  <tr>
                    <td>
                      Tên khách hàng
                      <br />
                      Số điện thoại
                      <br />
                      Email
                    </td>

                    <td>
                      {print &&
                        print.MaKhachHang &&
                        print.MaKhachHang.TenKhachHang &&
                        print?.MaKhachHang?.TenKhachHang}
                      <br />
                      {print && print.SDT && print?.SDT}
                      <br />
                      {print && print.email && print?.email}
                    </td>
                    <td></td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="heading">
              <td>Payment Method</td>
              <td></td>
              <td></td>
            </tr>

            <tr class="details">
              <td style={{ textTransform: "uppercase" }}>
                {print?.KieuThanhToan}
              </td>
              <td></td>
              <td></td>
            </tr>

            <tr class="heading">
              <td>Item</td>

              <td>Price</td>
              <td align="right">Quantity</td>
            </tr>
            {print && print.items ? (
              print.items.map((p, i) => (
                <tr class="item" key={i}>
                  <td>{p.sanpham.TenSanPham}</td>

                  <td>{p.sanpham.DonGia}đ</td>
                  <td align="right">{p.soluong}</td>
                </tr>
              ))
            ) : (
              <div>Không có sản phẩm nào</div>
            )}
            {/* <tr class="item">
            <td>Website design</td>
            <td>$300.00</td>
          </tr>
          <tr class="item">
            <td>Hosting (3 months)</td>
            <td>$75.00</td>
          </tr>
          <tr class="item last">
            <td>Domain name (1 year)</td>
            <td>$10.00</td>
          </tr> */}

            <tr class="total">
              <td></td>
              <td></td>
              <td align="right">Total: {print.TongTien}đ</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListOrder;
