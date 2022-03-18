import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "../src/assets/styles/tailwind.css";
import App from "./App";
import store from "app/store";
import { I18nextProvider } from "react-i18next";
import "./i18n";
ReactDOM.render(
  <Provider store={store}>
    <Suspense
      fallback={
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', textAlign: 'center'}}>
          <i class="fas fa-sync fa-spin"></i>
          <p>Đang xử lý</p>
        </div>
      }
    >
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);
