import React from "react";
import PropTypes from "prop-types";
import { Badge, Col, Drawer, Image, Row } from "antd";
import { PlusOutlined, StopOutlined } from "@ant-design/icons";
ImageUser.propTypes = {
  imageOnly: PropTypes.object,
  onOpenImg: PropTypes.func,
  onDelete: PropTypes.func,
};

ImageUser.defaultProps = {
  imageOnly: null,
  onOpenImg: null,
  onDelete: null,
};

function ImageUser(props) {
  const { imageOnly, onOpenImg, onDelete } = props;
  const onPickImage = () => {
    if (onOpenImg) onOpenImg();
  };
  const handleRemove = (id) => {
    console.log(id)
    if (onDelete) onDelete(id);
  };
  return (
    <div>
      {imageOnly ? (
       <Row justify="end" align="middle" gutter={10}>
        <Col
               span={24}
               style={{ display: "flex", justifyContent: "center" }}
             >
              
                 <img
                   src={`${imageOnly?.source}`}
                   alt={imageOnly._id}
                   style={{  width: window.innerWidth > 500 ? '400px' : '200px'}}
                   onClick={onPickImage}
                 />
             </Col>
     </Row>
      ) : (
        <div
        style={{ display: "flex", justifyContent: "center" }}
        
      >
        <img src="https://res.cloudinary.com/dkf71gpwy/image/upload/v1638611515/samples/download_acszkm.png" alt="err" style={{width: window.innerWidth > 500 ? '400px' : '200px', height: '100%'}} onClick={onPickImage}/>
      </div>
      )}
    </div>
  );
}

export default ImageUser;
