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
  InputNumber,
  Row,
  Col,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePro,
  getAll,
  getById,
  savePro,
} from "features/Product/productSlice";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import { getAllCategory } from "features/CategoryProduct/categoryProductSlice";
import ImageDisplay from "features/Product/components/ImageDisplay";
import HinhAnh from "features/HinhAnh";
import axiosClient from "api/axiosClient";
// THU VIEN DE LAY DA NGON NGU
import { useTranslation } from "react-i18next";
import { removeProduct, saveProduct } from "api/productApi";

ListProduct.propTypes = {};

function ListProduct(props) {
  const { t, i18n } = useTranslation();
  const { Option } = Select;
  const { TextArea } = Input;
  const data = useSelector((state) => state.products.products);
  const total = useSelector((state) => state.products.totalCount);
  const categories = useSelector((state) => state.categoryProducts.danhmucsp);
  const loading = useSelector((state) => state.products.loading);

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleImg, setVisibleImg] = useState(false);
  const [add, setAdd] = useState(false);
  const [value, setValue] = useState({
    _id: null,
    source: "",
  });
  const [submit, setSubmit] = useState(false);
  const handleSetValue = (a) => {
    console.log(a);
    setValue({ ...value, ...a });
  };
  const [valueForm, setValueForm] = useState({
    _id: null,
    TenSanPham: "",
    DonGia: null,
    MoTa: "",
    SoLuong: null,
    SoLuongDaBan: null,
    DanhMucSP: null,
    AnhMoTa: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
  });
  const form = useRef();
  const column = [
    {
      title: "CODE",
      dataIndex: "_id",
      key: "_id",
      className: "hidden",
    },
    {
      title: "ID",
      dataIndex: "code",
      key: "code",
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
      title: t && t("product.name"),
      dataIndex: "TenSanPham",
      key: "TenSanPham",
    },
    {
      title: t && t("product.images"),
      dataIndex: "AnhMoTa",
      key: "AnhMoTa",
      render: (record) => (
        <div>
          {record &&
            record.length &&
            record.map((p, index) => (
              <img
                key={index}
                src={`${p.source}`}
                alt=""
                style={{ width: "50px" }}
              />
            ))}
        </div>
      ),
    },
    {
      title: t && t("product.price"),
      dataIndex: "DonGia",
      key: "DonGia",
      sorter: (a, b) => a.DonGia - b.DonGia,
    },
    {
      title: t && t("product.quantity"),
      dataIndex: "SoLuong",
      key: "SoLuong",
    },
    {
      title: t && t("product.quantitySold"),
      dataIndex: "SoLuongDaBan",
      key: "SoLuongDaBan",
    },
    {
      title: t && t("product.category"),
      dataIndex: "DanhMucSP",
      key: "DanhMucSP",
      render: (record) => <span>{record?.TenDanhMucSP}</span>,
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

  const handleOpen = (formValue) => {
    if (formValue.code) {
      // form.current?.setFieldsValue({
      //   _id: formValue._id,
      //   TenSanPham: formValue.TenSanPham,
      //   DonGia: formValue.DonGia,
      //   MoTa: formValue.MoTa,
      //   SoLuong: formValue.SoLuong,
      //   SoLuongDaBan: formValue.SoLuongDaBan,
      //   DanhMucSP: formValue.DanhMucSP._id,
      //   AnhMoTa: formValue.AnhMoTa,
      // });
      setAdd(false);
      setValueForm({
        _id: formValue._id,
        TenSanPham: formValue.TenSanPham,
        DonGia: formValue.DonGia,
        MoTa: BraftEditor.createEditorState(formValue.MoTa),
        SoLuong: formValue.SoLuong,
        SoLuongDaBan: formValue.SoLuongDaBan,
        DanhMucSP: formValue.DanhMucSP._id,
        AnhMoTa: formValue.AnhMoTa,
      });
    } else {
      setAdd(true);
      form.current?.setFieldsValue({
        _id: null,
        TenSanPham: "",
        DonGia: null,
        MoTa: "",
        SoLuong: null,
        SoLuongDaBan: null,
        DanhMucSP: null,
        AnhMoTa: [],
      });
      setValueForm({
        _id: null,
        TenSanPham: "",
        DonGia: 0,
        MoTa: BraftEditor.createEditorState(""),
        SoLuong: 0,
        SoLuongDaBan: 0,
        DanhMucSP: null,
        AnhMoTa: [],
      });
    }

    setVisible(true);
  };

  const handleOpenImg = () => {
    setVisibleImg(true);
  };

  const handleCloseImg = () => {
    setVisibleImg(false);
    setValue({
      _id: 0,
      source: "",
    });
  };

  const handleClose = () => {
    setVisible(false);
    setValueForm({
      _id: null,
      TenSanPham: "",
      DonGia: null,
      MoTa: BraftEditor.createEditorState(""),
      SoLuong: null,
      SoLuongDaBan: null,
      DanhMucSP: null,
      AnhMoTa: [],
    });
  };

  const handleReloadData = async () => {
    const action = getAll();
    await dispatch(action);
  };

  const addImage = () => {
    let newArrayImg = valueForm.AnhMoTa
      ? [...valueForm.AnhMoTa]
      : Object.assign([], valueForm.AnhMoTa);
    if (newArrayImg.filter((p) => p._id == value._id).length > 0) {
      message.error("Không thể thêm ảnh trùng", 0.3);
    } else newArrayImg.push(value);
    setValueForm({ ...valueForm, AnhMoTa: newArrayImg });
    setVisibleImg(false);
    setValue({
      _id: 0,
      source: "",
    });
  };
  const handleConfirmDelete = async (id) => {
   
      const action = await removeProduct(id)
        .then((res) => message.success("Delete product success", 0.4))
        .catch((err) => {
          message.error(err.response.data.message, 1);
        });
      handleReloadData();
  
  };

  const handleDeleteImage = (id) => {
    let listAnh = valueForm.AnhMoTa;
    listAnh = listAnh.filter((p) => p._id !== id);
    setValueForm({ ...valueForm, AnhMoTa: listAnh });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    let sort = "";
    console.log(filters);
    if (sorter) {
      sort += sorter.order == "ascend" ? "" : "";
    }
    sort += sorter.field ? sorter.field : "code";
    let action;
    if (sort != "") {
      if (filters && filters.code &&  filters.code.length) {
        action = getAll({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
          keywords: filters?.code[0],
        });
      } else {
        action = getAll({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          sort: sort,
        });
      }
    } else {
      if (filters && filters.code && filters.code.length) {
        action = getAll({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
          keywords: filters?.code[0],
        });
      } else {
        action = getAll({
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

      setVisible(false);
      let arrImg = data.AnhMoTa.map((p, index) => p._id);
      const action = await saveProduct({
        ...data,
        AnhMoTa: arrImg,
        _id: valueForm._id,
      })
        .then((res) => message.success("Success",0.5))
        .catch((err) => message.success(err.response.data.message, 1));
        setSubmit(false);

      form.current.resetFields();
      setValueForm({
        _id: null,
        MoTa: "",
        AnhMoTa: [],
      });
      handleReloadData();
  
  };

  const handleChangeEditor = async (content) => {
    const htmlContent = content.toHTML();
    setValueForm({ ...valueForm, MoTa: htmlContent });
  };

  const getCategorySearch = async (value) => {
    try {
      let timeout;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => {
        const action = getAllCategory({
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

  useEffect(() => {
    if (!add) {
      console.log(valueForm.MoTa, "Hello");
      form.current?.setFieldsValue({
        _id: valueForm._id,
        TenSanPham: valueForm.TenSanPham,
        DonGia: valueForm.DonGia,
        MoTa: valueForm.MoTa,
        SoLuong: valueForm.SoLuong,
        SoLuongDaBan: valueForm.SoLuongDaBan,
        DanhMucSP: valueForm.DanhMucSP,
        AnhMoTa: valueForm.AnhMoTa,
      });
    } else {
      form.current?.setFieldsValue({
        _id: valueForm._id,
        MoTa: valueForm.MoTa,
        AnhMoTa: valueForm.AnhMoTa,
      });
    }
  }, [valueForm]);

  useEffect(() => {
    handleReloadData();
    const actionCategory = getAllCategory();
    dispatch(actionCategory);
  }, []);

  return (
    <div>
      <Button
        onClick={handleOpen}
        type="primary"
        style={{ margin: "10px 0px" }}
      >
        {t("product.add")}
      </Button>
      <Drawer
        visible={visible}
        placement="right"
        title={t && t("product.productForm")}
        width={window.innerWidth > 900 ? "50%" : "100%"}
        onClose={handleClose}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>{t("button.cancel")}</Button>
            <Button type="primary" form="formProduct" htmlType="submit" disabled={submit}>
              {t("button.submit")}
            </Button>
          </Space>
        }
      >
        <Form
          id="formProduct"
          ref={form}
          name="Form product"
          layout="vertical"
          onFinish={finishForm}
        >
          <Row gutter={10}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={t && t("product.name")}
                name="TenSanPham"
                rules={[
                  {
                    required: true,
                    message: t("product.Pleaseenteryournameproduct"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t && t("product.price")}
                name="DonGia"
                rules={[
                  {
                    required: true,
                    message: t("product.Pleaseenteryourpriceproduct"),
                    type: "number",
                    min: 0,
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label={t && t("product.quantity")}
                name="SoLuong"
                rules={[
                  {
                    required: true,
                    message: t("product.Pleaseenteryourquantityofproduct"),
                    type: "number",
                    min: 0,
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label={t && t("product.quantitySold")}
                name="SoLuongDaBan"
                rules={[
                  {
                    required: true,
                    message: t("product.Pleaseenteryourquantitysoldofproduct"),
                    type: "number",
                    min: 0,
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="DanhMucSP"
                label={t && t("product.category")}
                rules={[
                  {
                    required: true,
                    message: t("product.Pleaseselectcategory"),
                  },
                ]}
              >
                <Select
                  placeholder="select category"
                  showSearch
                  onSearch={getCategorySearch}
                  defaultActiveFirstOption={false}
                  filterOption={false}
                >
                  {categories.map((category, index) => (
                    <Option key={index} value={category._id}>
                      {category.TenDanhMucSP}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="AnhMoTa"
                label={t && t("product.images")}
                rules={[
                  { required: true, message: t("product.Pleaseselectimages") },
                ]}
                style={{
                  height: "100%",
                  flexDirection:
                    i18n.language == "en"
                      ? window.innerWidth > 900
                        ? "column"
                        : "row"
                      : "row",
                }}
              >
                <ImageDisplay
                  imageArray={valueForm.AnhMoTa}
                  onOpenImg={handleOpenImg}
                  onDelete={handleDeleteImage}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: "50px" }}>
            <Form.Item
              name="MoTa"
              label={t("product.desc")}
              style={{ flexDirection: "row" }}
            >
              <BraftEditor
                style={{
                  border: "1px solid gray",
                }}
                language="en"
                placeholder="Enter yout description"
                value={valueForm.MoTa}
                onChange={handleChangeEditor}
              />
            </Form.Item>
          </Row>
        </Form>
      </Drawer>
      <Drawer
        visible={visibleImg}
        placement="left"
        title="Image selector"
        width={1500}
        onClose={handleCloseImg}
        footer={
          <div style={{ textAlign: "end" }}>
            <Button disabled={!value._id} onClick={addImage} type="primary">
              Submit
            </Button>
          </div>
        }
      >
        <HinhAnh
          isChoose={true}
          value={value}
          handleSetValue={handleSetValue}
        />
      </Drawer>
      <Table
        columns={column}
        dataSource={data}
        scroll={{ x: 1500 }}
        pagination={{ ...pagination, total: total }}
        onChange={handleTableChange}
        loading={loading}
        rowKey="code"
      />
    </div>
  );
}

export default ListProduct;
