import { GiftOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

TodayOrder.propTypes = {
    total: PropTypes.number,
};

TodayOrder.defaultProps = {
    total: 0
}

function TodayOrder(props) {
  const { t } = useTranslation();
    const { total } = props
  return (
    <div>
      <Card title={t("layoutAdmin.TodayOrders")} style={{ width: "100%", marginBottom: "50px" }}>
        <p style={{ fontSize: "40px" }}>{total} <GiftOutlined /></p>
      </Card>
    </div>
  );
}

export default TodayOrder;
