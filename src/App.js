import { Layout, Menu } from 'antd';
import LayoutAdmin from 'features/LayoutAdmin';
import LoginForm from 'features/Login';
import { getMe } from 'features/Login/loginSlice';
import { createBrowserHistory } from 'history';
import { useEffect, useState } from 'react';
import React from 'react';
import useMetaTags from 'react-metatags-hook';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
function App() {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKeys,setSelectedKeys] = useState(1);
  const onCollapse = () => {
    const setCl = !collapsed;
    setCollapsed(setCl);
  };
  const dispatch = useDispatch();
  useMetaTags({
    title: "Food Land Admin"
  })

  const user = useSelector((state) => state.me.user);

  const token = useSelector((state) => state.me.token);
  const route = (
    <Switch>
      <Route path="/login" component={LoginForm} />
      {token == "" ? <Redirect to="/login" /> : <Redirect to="/" />}
    </Switch>
  );

  useEffect(() => {
    const action = getMe();
    dispatch(action);
  }, []);
  const history = createBrowserHistory({ forceRefresh: true });
  return (
    <Router history={history}>
      {token == "" ? (
        route
      ) : (
      <LayoutAdmin />
      )}
    </Router>
  );
}

export default App // instead of "export default App;"
