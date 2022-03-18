import { EyeOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

ImageCard.propTypes = {
  source: PropTypes.string,
  id: PropTypes.number,
  onPreview: PropTypes.func,
  onChoose: PropTypes.func,
  value: PropTypes.object,
  onPreviewImage: PropTypes.func,
};

ImageCard.defaultProps = {
  source: "",
  id: 0,
  onPreview: null,
  onChoose: null,
  onPreviewImage: null
};
function ImageCard(props) {
  const { source,id, onPreview, onChoose, value, onPreviewImage } = props;
  const [visible, setVisible] = useState(false);
  const [listImageChose,setListImageChose] = useState([])
  const handleDisplay = () => {
    setVisible(!visible);
  };
  const handlePreview = () => {
    if(onPreview) onPreview({
      _id: id,
      source: source
    })
    if(onPreviewImage) onPreviewImage({
      _id: id,
      source: source
    })
  }
  const handleChoose = () => {
    if(onChoose) onChoose({
      source: source,
      _id: id
    })
  }
  return (
    <div style={{ border: '1px solid #f5f5f5' }}>
      <div onClick={handleChoose} style={{ cursor: 'pointer'}}>
        <img
          src={`${source}`}
          alt="assets"
          style={{ height: "100%", width: "100%",objectFit: 'cover' }}
        />
      </div>
      <Space style={{ backgroundColor : '#f5f5f5', color: 'gray', width: '100%' , padding: '0px 10px'}}>
        <Button disabled={value?._id === id} type="link" onClick={handlePreview}><EyeOutlined /></Button>
        <span>ID: {id}</span>
      </Space>
    </div>
  );
}

export default ImageCard;
