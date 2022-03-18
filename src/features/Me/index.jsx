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
  DatePicker,
  Tag,
  Switch,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUs,
  getAllUs,
  getUsById,
  saveUs,
} from "features/User/userSlice.js";
import { formatPhone } from "app/format";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import ImageDisplay from "features/User/components/ImageDisplay";
import HinhAnh from "features/HinhAnh";
import axiosClient from "api/axiosClient";
import { boolean } from "yup/lib/locale";
import { useTranslation } from "react-i18next";
import { removeUser, saveUser } from "api/userApi";
import ImageUser from "./ImageUser";
import { getMe, setToken } from "features/Login/loginSlice";

MeInfo.propTypes = {};

function MeInfo(props) {
  // const handleOpen = (valueForm) => {
  //     if (valueForm._id) {
  //       setAdd(false);
  //       setValueForm({
  //         _id: valueForm._id,
  //         email: valueForm.email,
  //         password: valueForm.password,
  //         TenNhanVien: valueForm.TenNhanVien,
  //         TrangThai: valueForm.TrangThai,
  //         SDT: valueForm.SDT,
  //         roles: valueForm.roles,
  //         DiaChi: valueForm.DiaChi,
  //         Avatar: valueForm.Avatar,
  //       });
  //     } else {
  //       setAdd(true);
  //       form.current?.setFieldsValue({
  //         _id: 0,
  //         email: "",
  //         password: "",
  //         TenNhanVien: "",
  //         TrangThai: true,
  //         SDT: "",
  //         roles: null,
  //         DiaChi: "",
  //         Avatar: 0,
  //       });
  //       setValueForm({
  //         _id: 0,
  //         email: "",
  //         password: "",
  //         TenNhanVien: "",
  //         TrangThai: true,
  //         SDT: "",
  //         roles: null,
  //         DiaChi: "",
  //         Avatar: 0,
  //       });
  //     }
  //     setVisible(true);
  //   };
  const { Option } = Select;
  const { TextArea } = Input;
  const { t, i18n } = useTranslation();
  const data = useSelector((state) => state.users.users);
  const total = useSelector((state) => state.users.totalCount);
  const user = useSelector((state) => state.me.user);
  const dispatch = useDispatch();
  const [visibleImg, setVisibleImg] = useState(false);
  const [add, setAdd] = useState(false);
  const [value, setValue] = useState({
    _id: 0,
    source: "",
  });
  const [valueForm, setValueForm] = useState({
    _id: user._id,
    email: user.email,
    password: user.password,
    TenNhanVien: user?.TenNhanVien,
    TrangThai: user?.TrangThai,
    SDT: user?.SDT,
    DiaChi: user?.DiaChi,
    Avatar: user?.Avatar,
    roles: user.roles,
  });
  const handleSetValue = (a) => {
    // console.log(a);
    setValue({ ...value, ...a });
    console.log(value);
  };
  const form = useRef();
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

  const addImage = () => {
    // let newImg = []
    // newImg = valueForm.Avatar ? [...valueForm.Avatar] : Object.assign([], value.Avatar);
    // newImg.push(valueForm.Avatar);
    setValueForm({ ...valueForm, Avatar: value });
    console.log(valueForm);
    setVisibleImg(false);
    setValue({
      _id: 0,
      source: "",
    });
  };

  const handleDeleteImage = () => {
    setValueForm({ ...valueForm, Avatar: null });
  };

  const finishForm = async (data) => {
    try {
      if (data.password.match(/^\s*$/)) {
        const action = await saveUser({
          ...data,
          _id: valueForm._id,
          password: valueForm.password,
        })
          .then((res) => {
            message.success("Success", 0.3);
            const setTok = setToken(res.token);
            dispatch(setTok);
          })
          .catch((err) => message.success(err.response.data.message, 0.2));
      } else {
        const action = await saveUser({ ...data, _id: user._id })
          .then((res) => {
            message.success("Success", 0.3);
            const setTok = setToken(res.token);
            dispatch(setTok);
          })
          .catch((err) => message.success(err.response.data.message, 0.2));
      }
      const actionMe = getMe();
      await dispatch(actionMe);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const action = getMe();
    dispatch(action);
  }, []);
  useEffect(() => {
    const fetchApi = async () => {
      form?.current?.setFieldsValue({
        _id: valueForm?._id,
        email: valueForm?.email,
        password: "",
        TenNhanVien: valueForm?.TenNhanVien,
        TrangThai: valueForm?.TrangThai,
        SDT: valueForm?.SDT,
        roles: valueForm?.roles,
        DiaChi: valueForm?.DiaChi,
        Avatar: valueForm?.Avatar?._id,
      });
    };
    fetchApi();
  }, [valueForm]);
  return (
    <div>
      <Form
        id="formUser"
        ref={form}
        name="Form user"
        layout="vertical"
        onFinish={finishForm}
        initialValues={valueForm}
      >
        <Row gutter={10}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="Avatar"
              label={t && t("user.avatar")}
              rules={[{ required: true, message: t("user.pleaseSelectImage") }]}
            >
              <ImageUser
                imageOnly={valueForm?.Avatar}
                onOpenImg={handleOpenImg}
                onDelete={handleDeleteImage}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={t && t("user.email")}
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: t("user.pleaseEnterYourEmail"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={t && t("user.password")} name="password">
              <Input />
            </Form.Item>
            <Form.Item
              label={t && t("user.userName")}
              name="TenNhanVien"
              rules={[
                {
                  required: true,
                  message: t("user.pleaseEnterYourName"),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t && t("user.roles")}
              name="roles"
              rules={[
                {
                  required: true,
                  message: t("user.pleaseChooseYourRoles"),
                },
              ]}
            >
              <Select>
                <Option value={0}>{t && t("user.Administrator")}</Option>
                <Option value={1}>{t && t("user.Staff")}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t && t("user.address")}
              name="DiaChi"
              rules={[
                {
                  required: true,
                  message: t("user.pleaseEnterYourAddress"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t && t("user.status")}
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
              label={t && t("user.phoneNumber")}
              name="SDT"
              rules={[
                {
                  pattern: /((09|03|07|08|05)+([0-9]{8})\b)/g,
                  message: t("user.phoneNumberNotValid"),
                },
                {
                  required: true,
                  message: t("user.pleaseEnterYourPhoneNumber"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Drawer
        visible={visibleImg}
        placement="left"
        title={t("user.imageSelector")}
        width={1500}
        onClose={handleCloseImg}
        footer={
          <div style={{ textAlign: "end" }}>
            <Button disabled={!value._id} onClick={addImage} type="primary">
              {t("button.submit")}
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
    </div>
  );
}

export default MeInfo;
