import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Upload, Button, Row, Col, Progress, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getAll } from "features/HinhAnh/hinhanhSlice";
import { getAllImage } from "api/imageApi";
import { useTranslation } from 'react-i18next';

InputImage.propTypes = {};

function InputImage(props) {
  const { t } = useTranslation()
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [keywords, setKeywords] = useState("");
  const dispatch = useDispatch();
  const action = getAll({
    pageNo: 1,
    pageSize: 16,
  });
  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
   
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("image", file);
    try {
      console.log("Upload")
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}hinhanhs`,
        fmData,
        config
      ).then(res => message.success("Upload images success",0.3)).catch(err => message.error("Upload images error",0.3));
      await dispatch(action);
    } catch (err) {
      const error = new Error("Some error");
      onError({ err });
    }
  };
  const handleSearch = () => {
    if (keywords != "") {
      const action = getAll({ keywords });
      dispatch(action);
    } else {
      const action = getAll();
      dispatch(action);
    }
  };
  const handleChange = (e) => {
    setKeywords(e.target.value);

  };
  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
  };
  useEffect(() => {
    if(keywords == '')
    {
      dispatch(action);
    }
  }, [keywords])
  return (
    <Row style={{ width: "100%" }}>
      <Col xs={24} lg={16}>
        <Input.Search
          allowClear
          defaultValue=""
          style={{ width: "100%" }}
          value={keywords}
          onSearch={handleSearch}
          onChange={handleChange}
        />
      </Col>
      <Col lg={8}>
        <Upload
          accept="image/*"
          customRequest={uploadImage}
          onChange={handleOnChange}
          multiple
          maxCount={3}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>{t('assets.upload')}</Button>
        </Upload>
      </Col>
      <Col span={24}>
        {progress > 0 ? <Progress percent={progress} /> : null}
      </Col>
    </Row>
  );
}

export default InputImage;
