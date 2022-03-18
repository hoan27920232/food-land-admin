import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Column } from "@ant-design/charts";
import moment from "moment";
import { getAllOrd } from "features/DonHang/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFilterOrder } from "api/orderApi";
import { format } from "fecha";
import { groupBy } from "lodash";
import { Button, Card, Col, DatePicker, Row, Space } from "antd";
import Benefit from "./components/Benefit";
import CustomerNumber from "./components/CustomerNumber";
import TodayOrder from "./components/TodayOrder";
import { getAllCus } from "features/KhachHang/customerSlice";
import { useTranslation } from "react-i18next";
Home.propTypes = {};

function Home(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [annotations, setAnnotations] = useState([]);
  const [data, setData] = useState([]);
  const [dataTotal, setDataTotal] = useState([]);
  const [analyst, setAnalyst] = useState("week");
  const [analystTotal, setAnalystTotal] = useState("week");
  const customers = useSelector((state) => state.customers.customers);
  const { RangePicker } = DatePicker;
  const configTotal = {
    data: dataTotal,
    isStack: true,
    xField: "type",
    yField: "Total",
    seriesField: "diff",
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'top', 'bottom', 'middle'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: "interval-adjust-position",
        }, // 数据标签防遮挡
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    annotations: Object.values(groupBy(dataTotal, "type"))
      .map((p) => ({
        type: p[0].type,
        Total: p
          .map((p) => p.Total)
          .reduce(
            (a, b) => Number.parseInt(!a ? 0 : a) + Number.parseInt(!b ? 0 : b),
            0
          ),
      }))
      .map((p, index) => {
        return {
          type: "text",
          position: [p.type, p.Total],
          content: `${p.Total != 0 ? p.Total : ""}`,
          style: {
            textAlign: "center",
            fontSize: 14,
            fill: "rgba(0,0,0,0.85)",
          },
          offsetY: -10,
        };
      }),
  };
  const config = {
    data: data,
    isStack: true,
    xField: "type",
    yField: "Order",
    seriesField: "diff",
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'top', 'bottom', 'middle'
      // 可配置附加的布局方法
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: "interval-adjust-position",
        }, // 数据标签防遮挡
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    annotations: Object.values(groupBy(data, "type"))
      .map((p) => ({
        type: p[0].type,
        Order: p
          .map((p) => p.Order)
          .reduce(
            (a, b) =>
              Number.parseInt(a != "" ? 0 : a) +
              Number.parseInt(b != "" ? 0 : b),
            0
          ),
      }))
      .map((p, index) => {
        return {
          type: "text",
          position: [p.type, p.Order],
          content: `${p.Order != 0 ? p.Order : ""}`,
          style: {
            textAlign: "center",
            fontSize: 14,
            fill: "rgba(0,0,0,0.85)",
          },
          offsetY: -10,
        };
      }),
  };

  const customAnalyst = (date1, date2) => {
    if(!date1){
      setData([])
      return 
    }
    else{
      let dataFake = [];
      let a = orders?.filter(
        (p) =>
          moment(p.createdAt) > moment(date1[0]) &&
          moment(p.createdAt) < moment(date1[1])
      );
      let days = moment(date1[1]).diff(moment(date1[0]), "days");
      for (var i = days; i >= -1; i--) {
        let a = orders.filter(
          (p) =>
            moment(p.createdAt).format("DD/MM/YYYY") ==
            moment(moment(date1[1]).subtract(i.toString(), "days")).format(
              "DD/MM/YYYY"
            )
        );
        dataFake.push({
          type: moment(moment(date1[1]).subtract(i.toString(), "days")).format(
            "DD/MM"
          ),
          Order: a?.filter((p) => p.TrangThai == 0).length
            ? a?.filter((p) => p.TrangThai == 0).length
            : null,
          diff: "Incompleted order",
        });
        dataFake.push({
          type: moment(moment(date1[1]).subtract(i.toString(), "days")).format(
            "DD/MM"
          ),
          Order: a?.filter((p) => p.TrangThai == 1).length
            ? a?.filter((p) => p.TrangThai == 1).length
            : null,
          diff: "Completed order",
        });
      }
      setData(dataFake);
    }
  };
  const customAnalystTotal = (date1, date2) => {
    if(!date1){
      setData([])
      return 
    }
    else{
      let dataFake = [];
      let a = orders?.filter(
        (p) =>
          moment(p.createdAt) > moment(date1[0]) &&
          moment(p.createdAt) < moment(date1[1])
      );
      let days = moment(date1[1]).diff(moment(date1[0]), "days");
      for (var i = days; i >= -1; i--) {
        let a = orders.filter(
          (p) =>
            moment(p.createdAt).format("DD/MM/YYYY") ==
            moment(moment(date1[1]).subtract(i.toString(), "days")).format(
              "DD/MM/YYYY"
            )
        );
        dataFake.push({
          type: moment(moment(date1[1]).subtract(i.toString(), "days")).format(
            "DD/MM"
          ),
          Total: a?.filter((p) => p.TrangThai == 0).length
            ? a
                ?.filter((p) => p.TrangThai == 0)
                .map((p) => p.TongTien)
                .reduce((a, b) => a + b, 0)
            : null,
          diff: "Incompleted order",
        });
        dataFake.push({
          type: moment(moment(date1[1]).subtract(i.toString(), "days")).format(
            "DD/MM"
          ),
          Total: a?.filter((p) => p.TrangThai == 1).length
            ? a
                ?.filter((p) => p.TrangThai == 1)
                .map((p) => p.TongTien)
                .reduce((a, b) => a + b, 0)
            : null,
          diff: "Completed order",
        });
      }
      console.log(dataFake)
      setDataTotal(dataFake);
    }
  };

  const handleSetAnalystTotal = (value) => {
    setAnalystTotal(value);
  };

  const handleSetAnalyst = (value) => {
    setAnalyst(value);
  };

  useEffect(() => {
    async function fetchApi() {
      const data = await getFilterOrder();
      setOrders(orders);
      const totalAmount = data.data
        ?.filter((p) => p.TrangThai == 1)
        .map((p) => p.TongTien)
        .reduce((a, b) => a + b, 0);
      if (totalAmount) setTotal(totalAmount);
      let dataFake = [];
      if (analyst == "week") {
        for (var i = 6; i >= 0; i--) {
          let a = data.data?.filter(
            (p) =>
              moment(p.createdAt).format("DD/MM/YYYY") ==
              moment(moment().subtract(i.toString(), "days")).format(
                "DD/MM/YYYY"
              )
          );
          dataFake.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Order: a?.filter((p) => p.TrangThai == 0).length
              ? a?.filter((p) => p.TrangThai == 0).length
              : null,
            diff: "Incompleted order",
          });
          dataFake.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Order: a?.filter((p) => p.TrangThai == 1).length
              ? a?.filter((p) => p.TrangThai == 1).length
              : null,
            diff: "Completed order",
          });
        }
      } else if (analyst == "month") {
        for (var i = 30; i >= 0; i--) {
          let a = data.data?.filter(
            (p) =>
              moment(p.createdAt).format("DD/MM/YYYY") ==
              moment(moment().subtract(i.toString(), "days")).format(
                "DD/MM/YYYY"
              )
          );
          dataFake.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Order: a.filter((p) => p.TrangThai == 0).length
              ? a.filter((p) => p.TrangThai == 0).length
              : null,
            diff: "Incompleted order",
          });
          dataFake.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Order: a.filter((p) => p.TrangThai == 1).length
              ? a.filter((p) => p.TrangThai == 1).length
              : null,
            diff: "Completed order",
          });
        }
      } else if (analyst == "year") {
        for (var i = 11; i >= 0; i--) {
          let a = data.data?.filter((p) => {
            return (
              moment(p.createdAt) <
                moment(moment().subtract(i.toString(), "months")) &&
              moment(p.createdAt) >
                moment(moment().subtract((i + 1).toString(), "months"))
            );
          });
          console.log(a, i);
          dataFake.push({
            type: moment(moment().subtract(i.toString(), "months")).format(
              "MM/YYYY"
            ),
            Order: a.filter((p) => p.TrangThai == 0).length
              ? a.filter((p) => p.TrangThai == 0).length
              : null,
            diff: "Incompleted order",
          });
          dataFake.push({
            type: moment(moment().subtract(i.toString(), "months")).format(
              "MM/YYYY"
            ),
            Order: a.filter((p) => p.TrangThai == 1).length
              ? a.filter((p) => p.TrangThai == 1).length
              : null,
            diff: "Completed order",
          });
        }
      }
      setData(dataFake);
    }
    fetchApi();
  }, [analyst]);
  useEffect(() => {
    async function fetchApi() {
      const data = await getFilterOrder();
      setOrders(data.data);
      const totalAmount = data.data
        ?.filter((p) => p.TrangThai == 1)
        .map((p) => p.TongTien)
        .reduce((a, b) => a + b, 0);
      if (totalAmount) setTotal(totalAmount);
      let dataFakeTotal = [];
      if (analystTotal == "week") {
        for (var i = 6; i >= 0; i--) {
          let a = data.data?.filter(
            (p) =>
              moment(p.createdAt).format("DD/MM/YYYY") ==
              moment(moment().subtract(i.toString(), "days")).format(
                "DD/MM/YYYY"
              )
          );
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Total: a?.filter((p) => p.TrangThai == 0).length
              ? a
                  ?.filter((p) => p.TrangThai == 0)
                  .map((p) => {
                    return p.TongTien;
                  })
                  .reduce((a, b) => a + b, 0)
              : null,
            diff: "Incompleted order",
          });
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Total: a?.filter((p) => p.TrangThai == 1).length
              ? a
                  ?.filter((p) => p.TrangThai == 1)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : null,
            diff: "Completed order",
          });
        }
      } else if (analystTotal == "month") {
        for (var i = 30; i >= 0; i--) {
          let a = data.data?.filter(
            (p) =>
              moment(p.createdAt).format("DD/MM/YYYY") ==
              moment(moment().subtract(i.toString(), "days")).format(
                "DD/MM/YYYY"
              )
          );
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Total: a.filter((p) => p.TrangThai == 0).length
              ? a
                  .filter((p) => p.TrangThai == 0)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : null,
            diff: "Incompleted order",
          });
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "days")).format(
              "DD/MM"
            ),
            Total: a.filter((p) => p.TrangThai == 1).length
              ? a
                  .filter((p) => p.TrangThai == 1)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : null,
            diff: "Completed order",
          });
        }
      } else if (analystTotal == "year") {
        for (var i = 11; i >= 0; i--) {
          let a = data.data?.filter((p) => {
            return (
              moment(p.createdAt) <
                moment(moment().subtract(i.toString(), "months")) &&
              moment(p.createdAt) >
                moment(moment().subtract((i + 1).toString(), "months"))
            );
          });
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "months")).format(
              "MM/YYYY"
            ),
            Total: a.filter((p) => p.TrangThai == 0).length
              ? a
                  .filter((p) => p.TrangThai == 0)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : null,
            diff: "Incompleted order",
          });
          dataFakeTotal.push({
            type: moment(moment().subtract(i.toString(), "months")).format(
              "MM/YYYY"
            ),
            Total: a.filter((p) => p.TrangThai == 1).length
              ? a
                  .filter((p) => p.TrangThai == 1)
                  .map((p) => p.TongTien)
                  .reduce((a, b) => a + b, 0)
              : null,
            diff: "Completed order",
          });
        }
      }
      setDataTotal(dataFakeTotal);
    }
    fetchApi();
  }, [analystTotal]);
  useEffect(() => {
    const action = getAllCus();
    dispatch(action);
  }, []);
  return (
    <div>
      <Row style={{ width: "100%" }} gutter={40}>
        <Col xs={24} lg={12}>
          <Benefit total={total} />
        </Col>
        <Col xs={12} lg={6}>
          <CustomerNumber
            total={customers?.length}
            block={customers?.filter((p) => !p.TrangThai)?.length}
            active={customers?.filter((p) => p.TrangThai)?.length}
          />
        </Col>
        <Col xs={12} lg={6}>
          <TodayOrder
            total={
              orders
                ?.filter(
                  (p) =>
                    moment(p.createdAt).format("DD/MM/YYYY") ==
                    moment(moment()).format("DD/MM/YYYY")
                )
                .filter((p) => p.TrangThai == 0).length
            }
          />
        </Col>
      </Row>
      <Card
        title={t("layoutAdmin.AnalystOrder")}
        style={{ marginBottom: "50px" }}
        extra={
          <Space size={5}>
            <Button
              type={analyst == "week" && "primary"}
              onClick={() => handleSetAnalyst("week")}
            >
              {t("layoutAdmin.Week")}
            </Button>
            <Button
              type={analyst == "month" && "primary"}
              onClick={() => handleSetAnalyst("month")}
            >
              {t("layoutAdmin.Month")}
            </Button>
            <Button
              type={analyst == "year" && "primary"}
              onClick={() => handleSetAnalyst("year")}
            >
              {t("layoutAdmin.Year")}
            </Button>
            <Button
              type={analyst == "custom" && "primary"}
              onClick={() => handleSetAnalyst("custom")}
            >
              {t("layoutAdmin.Custom")}
            </Button>
            <RangePicker
              disabled={analyst != "custom"}
              onChange={customAnalyst}
            />
          </Space>
        }
      >
        <Column {...config} />
      </Card>
      <Card
        title={t("layoutAdmin.AnalystTotal")}
        extra={
          <Space size={5}>
            <Button
              type={analystTotal == "week" && "primary"}
              onClick={() => handleSetAnalystTotal("week")}
            >
              {t("layoutAdmin.Week")}
            </Button>
            <Button
              type={analystTotal == "month" && "primary"}
              onClick={() => handleSetAnalystTotal("month")}
            >
              {t("layoutAdmin.Month")}
            </Button>
            <Button
              type={analystTotal == "year" && "primary"}
              onClick={() => handleSetAnalystTotal("year")}
            >
              {t("layoutAdmin.Year")}
            </Button>
            <Button
              type={analystTotal == "custom" && "primary"}
              onClick={() => handleSetAnalystTotal("custom")}
            >
              {t("layoutAdmin.Custom")}
            </Button>
            <RangePicker
              disabled={analystTotal != "custom"}
              onChange={customAnalystTotal}
            />
          </Space>
        }
      >
        <Column {...configTotal} />
      </Card>
    </div>
  );
}

export default Home;
