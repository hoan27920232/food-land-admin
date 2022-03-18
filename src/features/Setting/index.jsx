import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Row,
} from "antd";
import HinhAnh from "features/HinhAnh";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { P } from "@antv/g2plot";
import { AllSetting, saveSetting } from "api/settingApi";

Setting.propTypes = {};
const { TextArea } = Input;

function Setting(props) {
  const form = useRef();
  const [value, setValue] = useState({
    _id: 0,
    source: "",
  });
  const [indexBanner, setIndexBanner] = useState(0);
  const [settings, setSettings] = useState([{ _id: 1 }]);
  const [visibleImg, setVisibleImg] = useState(false);
  const { t } = useTranslation();
  const [idImg, setIdImg] = useState("");
  const [type, setType] = useState("");
  const finishForm = (values) => {
    try {
      const formatValues = Object.entries(values).map((p) => ({
        _id: p[0],
        value: p[1],
      }));
      const modifiedSettings = formatValues.map((s) => ({
        _id: s._id,
        value: s.value,
      }));

      const save = saveSetting(modifiedSettings)
        .then((data) => message.success("Update success", 0.3))
        .catch((err) => message.error(err.response.data.message, 0.3));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseImg = () => {
    setVisibleImg(false);
    setValue({
      _id: 0,
      source: ''
    })
  };

  const addImage = () => {
    const setImg = {};
    if (type === "img-link-arr") {
      let cloneBanner = form?.current?.getFieldValue(idImg);
      cloneBanner[indexBanner] = {
        ...cloneBanner[indexBanner],
        image: value.source,
      };
      setImg[idImg] = cloneBanner;
      form?.current?.setFieldsValue(setImg);
    } else if (type === "img-link-text-single") {
      let cloneBanner = form?.current?.getFieldValue(idImg);
      cloneBanner = { ...cloneBanner, image: value.source };
      setImg[idImg] = cloneBanner;
      form?.current?.setFieldsValue(setImg);
    } else if (type === "img") {
      let cloneBanner = form?.current?.getFieldValue(idImg);
      cloneBanner = { ...cloneBanner, image: value.source };
      setImg[idImg] = cloneBanner.image;
      form?.current?.setFieldsValue(setImg);
    }
    setVisibleImg(false);
  };

  const handleSetValue = (a) => {
    setValue(a);
  };

  useEffect(() => {
    const fetchSetting = async () => {
      const data = await AllSetting();
      setSettings(data);
      const object = {};
      for (const setting of data) {
        object[setting._id] = setting.value;
      }
      form?.current?.setFieldsValue(object);
    };
    fetchSetting();
  }, []);

  const handleOpenImg = (indentity, type, index) => {
    if (type == "img-link-arr") {
      setIndexBanner(index);
      setIdImg(indentity);
      setType(type);
    } else if (type == "img-link-text-single") {
      setIdImg(indentity);
      setType(type);
    } else if (type == "img") {
      setIdImg(indentity);
      setType(type);
    }
    setVisibleImg(true);
  };

  const setBannerSlide = (index) => {};

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "30px", margin: "0" }}>{t("setting.setting")}</p>
        <Button form="formSetting" htmlType="submit" type="primary">
          {t("setting.update")}
        </Button>
      </div>
      <hr style={{ marginBottom: "30px" }} />
      <Form
        id="formSetting"
        ref={form}
        name="Form Setting"
        onFinish={finishForm}
        layout="vertical"
      >
        {settings &&
          settings.length &&
          settings.map((p, index) => {
            if (p.type === "img-link-arr") {
              return (
                <Card title={p.name} style={{ marginBottom: "20px" }}>
                  <Form.List
                    key={index}
                    name={p._id}
                    rules={[
                      {
                        validator: async (_, items) => {
                          if (!items || items.length < 1) {
                            return Promise.reject(
                              new Error("At least 1 banner")
                            );
                          }
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((field, i) => (
                          <Form.Item
                            key={i}
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
                                gutter="2"
                              >
                                <Divider>
                                  {t("setting.setting") + (i + 1)}
                                </Divider>
                                <Col span="24">
                                  <Form.Item>
                                    <Input.Group>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "image"]}
                                        fieldKey={[field.fieldKey, "image"]}
                                        validateTrigger={["onChange", "onBlur"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: t("setting.pickImage"),
                                            // message: "Pick image",
                                          },
                                        ]}
                                      >
                                        <Input
                                          style={{
                                            width: "calc(100% - 100px)",
                                          }}
                                        />
                                      </Form.Item>
                                      <Button
                                        type="primary"
                                        onClick={() =>
                                          handleOpenImg(p._id, p.type, i)
                                        }
                                      >
                                        {t("setting.select")}
                                      </Button>
                                    </Input.Group>
                                  </Form.Item>
                                </Col>
                                <Col span="24" style={{ display: "flex" }}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, "url"]}
                                    fieldKey={[field.fieldKey, "url"]}
                                    validateTrigger={["onChange", "onBlur"]}
                                    style={{ width: "100%" }}
                                    rules={[
                                      {
                                        required: true,
                                        message: t("setting.enterYourUrlHere"),
                                        // message: `Enter your url here`,
                                      },
                                    ]}
                                  >
                                    <TextArea
                                      placeholder={t && t("setting.urlBanner")}
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                </Col>

                                <Button
                                  onClick={() => remove(field.name)}
                                  danger
                                  style={{ marginBottom: "10px" }}
                                >
                                  {t("setting.delete")}
                                </Button>
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
                            {t("setting.addBanner")}
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              );
            } else if (p.type === "img-link-text-single") {
              return (
                <Card
                  title={p.name}
                  key={index}
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Item>
                    <Input.Group compact>
                      <Form.Item
                        label={t && t("setting.imageBanner")}
                        name={[p._id, "image"]}
                        style={{ width: "100%" }}
                        rules={[
                          {
                            required: true,
                            message: t("setting.selectYourImageBeforeSubmit"),
                            // message: `Select your image before submit`,
                          },
                        ]}
                      >
                        <Input style={{ width: "calc(100% - 100px)" }} />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => handleOpenImg(p._id, p.type, 0)}
                      >
                        {t("setting.select")}
                      </Button>
                    </Input.Group>
                  </Form.Item>
                  <Form.Item
                    name={[p._id, "url"]}
                    label={t && t("setting.url")}
                    rules={[
                      {
                        required: true,
                        message: t("setting.selectYourUrlBeforeSubmit"),
                        // message: `Select your url before submit`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[p._id, "text"]}
                    label={t && t("setting.textBanner")}
                    rules={[
                      {
                        required: true,
                        message: t("setting.selectYourUrlBeforeSubmit"),
                        // message: `Select your url before submit`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Card>
              );
            } else if (p.type === "img") {
              return (
                <Card
                  title={t && t("setting.bannerProduct")}
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Item>
                    <Input.Group compact>
                      <Form.Item
                        key={index}
                        label={p.name}
                        name={p._id}
                        style={{ width: "100%" }}
                        rules={[
                          {
                            required: true,
                            message: t("setting.enterYourDataBeforeSubmit"),
                            // message: `Enter your data before submit`,
                          },
                        ]}
                      >
                        <Input style={{ width: "calc(100% - 100px)" }} />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => handleOpenImg(p._id, p.type, 0)}
                      >
                        {t("setting.select")}
                      </Button>
                    </Input.Group>
                  </Form.Item>
                </Card>
              );
            }
          })}
        <Card title={t && t("setting.information")}>
          {settings &&
            settings.length &&
            settings.map((p, index) => {
              return (
                <div>
                  {p.type === "string" && (
                    <Form.Item
                      label={t && t(`setting.${p.name}`)}
                      name={p._id}
                      rules={[
                        {
                          required: true,
                          message: t("setting.enterYourDataBeforeSubmit"),
                          // message: `Enter your data before submit`,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  )}
                </div>
              );
            })}
        </Card>
      </Form>
      <Drawer
        visible={visibleImg}
        placement="left"
        title={t && t("setting.imageSelector")}
        width={1500}
        onClose={handleCloseImg}
        footer={
          <div style={{ textAlign: "end" }}>
            <Button disabled={!value._id} onClick={addImage} type="primary">
              Select
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
      <div style={{ textAlign: "end", marginTop: "20px" }}>
        <Button form="formSetting" htmlType="submit" type="primary">
          {t("setting.update")}
        </Button>
      </div>
    </div>
  );
}

export default Setting;
