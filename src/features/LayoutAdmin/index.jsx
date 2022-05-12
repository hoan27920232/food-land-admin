import {
  GiftOutlined,
  IdcardOutlined,
  PictureOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  FormOutlined,
  UserOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Layout, Menu, Sider, Typography } from 'antd';
import Logout from 'components/Logout';
import Blog from 'features/Blog';
import CategoryBlog from 'features/CategoryBlog';
import Product from 'features/Product';
import ListCategoryProduct from 'features/CategoryProduct/pages/ListCategoryProduct';
import DonHang from 'features/DonHang';
import HinhAnh from 'features/HinhAnh';
import Home from 'features/Home';
import KhachHang from 'features/KhachHang';
import User from 'features/User';

import Discount from 'features/Discount';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router'
import Setting from 'features/Setting';
import MeInfo from 'features/Me';
LayoutAdmin.propTypes = {
    
};
const { SubMenu } = Menu;

function LayoutAdmin(props) {
    const { Title } = Typography;
    const { t } = useTranslation()
    const [collapsed, setCollapsed] = useState(true);
    const [selectedKeys,setSelectedKeys] = useState("1");
    const token = useSelector(state => state.me.token)
    const history = useHistory()
    const user = useSelector((state) => state.me.user);
    
    const location = useLocation()
  const onCollapse = () => {
    const setCl = !collapsed;
    setCollapsed(setCl);
  };
  const handleSetKeys = (key) => {
    setSelectedKeys(key)
  }
  const { Header, Content, Footer, Sider } = Layout;
  useEffect(() => {
    if(token && location.pathname == "/login")
    {
      history.push("/")
    }
    if(location.pathname == "/dashboard" || location.pathname == "/")
      {
        setSelectedKeys("1")
      }
      else if(location.pathname == "/hinhanh")
      {
        setSelectedKeys("2")
      }
      else if(location.pathname == "/products")
      {
        setSelectedKeys("3")
      }
      else if(location.pathname == "/categoryProduct")
      {
        setSelectedKeys("4")
      }
      else if(location.pathname == "/blogs")
      {
        setSelectedKeys("5")
      }
      else if(location.pathname == "/categoryBlogs")
      {
        setSelectedKeys("6")
      }
      else if(location.pathname == "/orders")
      {
        setSelectedKeys("7")
      }
      else if(location.pathname == "/discounts")
      {
        setSelectedKeys("8")
      }
      else if(location.pathname == "/customers")
      {
        setSelectedKeys("9")
      }
      else if(location.pathname == "/users")
      {
        setSelectedKeys("10")
      }
      else if(location.pathname == "/settings")
      {
        setSelectedKeys("11")
      }
      else if(location.pathname == "/me")
      {
        setSelectedKeys("12")
      }
      else{
        setSelectedKeys("1")

      }
  }, [])
    return (
        <Layout style={{ minHeight: "100vh", position: "relative" }}>
        <Logout />
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => onCollapse()}
        >
          <div style={{ textAlign: "center", margin: "10px 0px" }}>
            <Avatar
              src={
                user && user.Avatar && user.Avatar.source
                  ? user.Avatar.source
                  : "https://joeschmoe.io/api/v1/random"
              }
            />
            {!collapsed && (
              <Title
                level={3}
                style={{ color: "white", padding: "10px 0px" }}
              >
                {t("menu.welcome")} {user?.TenNhanVien?.split(" ")[0]}
              </Title>
            )}
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => handleSetKeys("1")}>
              <Link to="/">{t("menu.dashboard")}</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<PictureOutlined />} onClick={() => handleSetKeys("2")}>
              <Link to="/hinhanh">{t("menu.assets")}</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<ShopOutlined />} title={t("menu.products")} >
              <Menu.Item key="3" onClick={() => handleSetKeys("3")}>
                <Link to="/products">{t("menu.products")}</Link>
              </Menu.Item>
              <Menu.Item key="4" onClick={() => handleSetKeys("4")}>
                <Link to="/categoryProduct">{t("menu.category")}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<FormOutlined />} title={t("menu.blogs")}>
              <Menu.Item key="5" onClick={() => handleSetKeys("5")}><Link to="/blogs">{t("menu.blogs")}</Link></Menu.Item>
              <Menu.Item key="6" onClick={() => handleSetKeys("6")}><Link to="/categoryBlogs">{t("menu.categoryBlog")}</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="7" icon={<GiftOutlined />} onClick={() => handleSetKeys("7")}>
            <Link to="/orders">{t("menu.orders")}</Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<TagOutlined />} onClick={() => handleSetKeys("8")}>
            <Link to="/discounts">{t("menu.discounts")}</Link>
            </Menu.Item>
            <Menu.Item key="9" icon={<TeamOutlined />} onClick={() => handleSetKeys("9")}>
            <Link to="/customers">{t("menu.customers")}</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<IdcardOutlined />} onClick={() => handleSetKeys("10")}>
            <Link to="/users">{t("menu.users")}</Link>
            </Menu.Item>
            <Menu.Item key="11" icon={<SettingOutlined />} onClick={() => handleSetKeys("11")}>
            <Link to="/settings">{t("menu.settings")}</Link>
            </Menu.Item>
            <Menu.Item key="12" icon={<UserOutlined />} onClick={() => handleSetKeys("12")}>
            <Link to="/me">{t("menu.me")}</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>LMG Admin</Breadcrumb.Item>
              <Breadcrumb.Item>
                {selectedKeys == "1" && t("menu.dashboard")}
                {selectedKeys == "2" && t("menu.assets")}
                {selectedKeys == "3" && t("menu.products")}
                {selectedKeys == "4" && t("menu.category")}
                {selectedKeys == "5" && t("menu.blogs")}
                {selectedKeys == "6" && t("menu.categoryBlog")}
                {selectedKeys == "7" && t("menu.orders")}
                {selectedKeys == "8" && t("menu.discounts")}
                {selectedKeys == "9" && t("menu.customers")}
                {selectedKeys == "10" && t("menu.users")}
                {selectedKeys == "11" && t("menu.settings")}
                {selectedKeys == "12" && t("menu.me")}
              </Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/hinhanh" component={HinhAnh} />
                <Route path="/products" component={Product} />
                <Route path="/categoryProduct" component={ListCategoryProduct} />
                <Route path="/blogs" component={Blog} />
                <Route path="/customers" component={KhachHang} />
                <Route path="/categoryBlogs" component={CategoryBlog} />
                <Route path="/users" component={User} />
                <Route path="/orders" component={DonHang} />
                <Route path="/settings" component={Setting} />
                <Route path="/me" component={MeInfo} />
                <Route path="/discounts" component={Discount} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Tay Bac Management 2022
          </Footer>
        </Layout>
      </Layout>
    );
}

export default LayoutAdmin;