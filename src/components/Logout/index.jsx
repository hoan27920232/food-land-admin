import React from "react";
import PropTypes from "prop-types";
import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Avatar,
  Button,
  Space,
  Dropdown,
} from "antd";
import { LogoutOutlined, GlobalOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "features/Login/loginSlice";
import { useTranslation } from 'react-i18next';

Logout.propTypes = {};

function Logout(props) {
  const {t, i18n} = useTranslation();
  const user = useSelector((state) => state.me.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    const action = logout();
    dispatch(action);
    history.push("/login");
  };
  const TranslateClick = (lang) =>  {
    i18n.changeLanguage(lang);
}
  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="link" onClick={handleLogout}>
          <Space>
            <LogoutOutlined />
            Logout
          </Space>
        </Button>
      </Menu.Item>
    </Menu>
  );
  const lang = (
    <Menu style={{ marginTop : '10px'}}>
      <Menu.Item>
        <Button type="link" onClick={() => TranslateClick("en")}>
          English
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="link" onClick={() => TranslateClick("vi")}>
          Việt nam
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Space size={20} style={{ position: "absolute", top: "20px", right: "100px" }}>
      <Dropdown overlay={menu} placement="bottomCenter" arrow>
        <Avatar
          size="small"
          src={
            user && user.Avatar && user.Avatar.source
              ? user.Avatar.source
              : "https://joeschmoe.io/api/v1/random"
          }
        />
      </Dropdown>
      <Dropdown overlay={lang} placement="bottomCenter" arrow>
        <GlobalOutlined />
      </Dropdown>
    </Space>
  );
}

export default Logout;
