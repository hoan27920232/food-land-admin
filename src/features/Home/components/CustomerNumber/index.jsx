import { CheckCircleOutlined, CloseCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

CustomerNumber.propTypes = {
    total: PropTypes.number,
    block:PropTypes.number,
    active: PropTypes.number,
};
CustomerNumber.defaultProps = {
    total: 0,
    block: 0,
    active: 0,
}
function CustomerNumber(props) {
    const { t } = useTranslation();
    const { total,block,active } = props
    return (
        <Card title={t("layoutAdmin.Customers")} style={{ width : '100%', marginBottom: '50px'}}>
            <Space size={20}>
            <p style={{ fontSize: '40px' }}>{total} <TeamOutlined /></p>
            <p style={{ fontSize: '40px' }}>{active} <CheckCircleOutlined style={{ color: 'green'}}/></p>
            <p style={{ fontSize: '40px' }}>{block} <CloseCircleOutlined style={{ color: 'red'}}/></p>
            </Space>
        </Card>
    );
}

export default CustomerNumber;