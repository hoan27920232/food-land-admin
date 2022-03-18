import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd'
import { formatCurrency } from 'app/format';
import { useTranslation } from 'react-i18next';
Benefit.propTypes = {
    total: PropTypes.number,
};
Benefit.defaultProps = {
    total: 0
}
function Benefit(props) {
    const { t } = useTranslation();
    const { total } = props
    return (
        <Card title= {t("layoutAdmin.Total")} style={{ width : '100%', marginBottom: '50px'}}>
            <p style={{ fontSize: '40px' }}>{ formatCurrency(total) }</p>
        </Card>
    );
}

export default Benefit;