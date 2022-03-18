import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/images/KFC-Emblem.png";
import { useDispatch, useSelector } from "react-redux";
import { loginSucces, loginThunk } from "./loginSlice";
import { useHistory } from "react-router-dom";
import { login } from "api/userApi";

LoginForm.propTypes = {};

function LoginForm(props) {
  const token = useSelector((state) => state.me.token);
  const [form] = Form.useForm();
  const success = useSelector((state) => state.me.success);
  const history = useHistory();
  const { Title } = Typography;
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState(false);
  const onFinish = async (values) => {
    setSubmit(true);
    const action = await login(values)
    .then((res) => {
      message.success("Login success", 1);
      const action = loginSucces(res)
      dispatch(action)
      history.push("/");
    })
    .catch((err) => {
      message.error("Email or password not correct", 0.6);
    });
    setSubmit(false);
  };
  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh", position: "relative" }}
      className="bg-login"
    >
      <Col xs={16} md={12} lg={4} style={{ marginBottom: "100px" }}>
        <Row gutter={[0, 30]}>
          <Col
            span={24}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Title level={2} style={{ textAlign: "center" }}>
              ADMINISTRATOR
            </Title>
            <img
              src={logo}
              alt=""
              style={{ width: "100%", objectFit: "cover" }}
            />
          </Col>
          <Col span={24}>
            <Form
              form={form}
              name="horizontal_login"
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  style={{ height: "35px" }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  style={{ height: "35px" }}
                />
              </Form.Item>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%", height: "35px" }}
                    disabled={submit}
                  >
                    Log in
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default LoginForm;
