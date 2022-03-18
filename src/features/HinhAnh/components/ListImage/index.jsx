import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { identity } from '@antv/util';
import { Badge, Button, Col, message, Modal, Pagination, Popconfirm, Row } from 'antd';
import { getAll, removeImg } from 'features/HinhAnh/hinhanhSlice';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ImageCard from './ImageCard';
import { removeAnImage } from 'api/imageApi';

ListImage.propTypes = {
  listImg: PropTypes.array,
  totalCount: PropTypes.number,
  handleOnChange: PropTypes.func,
  isChoose: PropTypes.bool,
  handleSetValue: PropTypes.func,
  value: PropTypes.object,
};
ListImage.defaultProps = {
  listImg: [],
  totalCount: 0,
  handleOnChange: null,
  isChoose: false,
  handleSetValue: null,
};
function ListImage(props) {
  const { t } = useTranslation() 
  const { listImg, totalCount, handleOnChange, value, handleSetValue } = props;
  const [visible, setVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState({
    _id: 0,
    source: ''
  })
  const dispatch = useDispatch()
  const onChange = (page, pageSize) => {
    if (handleOnChange) handleOnChange(page, pageSize);
  };
  const onPreview = (value) => {
    if(handleSetValue)
    handleSetValue(value)
    setVisible(true);
  };
  const onPreviewImage = (value) => {
    setImagePreview(value)
    setVisible(true);
  };
  const onChoose = (a) => {
      if(handleSetValue)
      handleSetValue(a);
  };
  const handleConfirmDelete = async (id) => {
   try{
    const action = await removeAnImage(id).then(res => message.success("Delete success",0.2)).catch(err => message.error(err.response.data.message,0.3))
    setVisible(false)
    const action2 = getAll({
      pageNo: 1,
      pageSize: 16
    })
    dispatch(action2)
   }catch(err){
     console.log(err)
   }

  };
  return (
    <div>
      <Row gutter={[10, 10]} style={{ marginTop: "50px" }}>
        {listImg &&
          listImg.map((image, index) => (
            <Col xs={24} md={6} lg={3} key={index}>
              <Badge
                count={image._id === value?._id ? <CheckCircleOutlined style={{ color: 'green' }}/> : 0}
              >
                <ImageCard
                  source={image.source}
                  id={image._id}
                  onPreview={onPreview}
                  onChoose={onChoose}
                  value={value}
                  onPreviewImage={onPreviewImage}
                />
              </Badge>
            </Col>
          ))}
        <Col span={24} style={{ textAlign: "right", marginTop: "50px" }}>
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={totalCount}
            onChange={(page, pageSize) => onChange(page, pageSize)}
            pageSize={16}
          />
        </Col>
      </Row>
      <Modal
        title={`ID: ${imagePreview?._id}`}
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => handleConfirmDelete(imagePreview?._id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger>{t('button.delete')}</Button>
          </Popconfirm>,
        ]}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={`${imagePreview?.source}`}
            alt="source"
            style={{ width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ListImage;
