import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputImage from "features/HinhAnh/components/InputImage";
import ListImage from "./components/ListImage";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "features/HinhAnh/hinhanhSlice";
HinhAnh.propTypes = {
  isChoose: PropTypes.bool,
  handleSetValue: PropTypes.func,
  value: PropTypes.object,
};

HinhAnh.defaultProps = {
  isChoose: false
}
function HinhAnh(props) {
  const { isChoose, setIsChoose, handleSetValue, value } = props
  const listImg = useSelector((state) => state.images.images);
  const totalCount = useSelector((state) => state.images.totalCount);
  const [paramsDefault, setParamsDefault] = useState({
    pageNo: 1,
    pageSize: 16,
  });
  const [currentImage, setCurrentImage] = useState({})
  
  const dispatch = useDispatch();
  useEffect(() => {
    const action = getAll(paramsDefault);
    dispatch(action);
  }, [paramsDefault]);
  const onChange = (page, pageSize) => {
    setParamsDefault({
      ...paramsDefault,
      pageNo: page,
    });
  };
  return (
    <div>
      <InputImage />
      <ListImage
        listImg={listImg}
        totalCount={totalCount}
        handleOnChange={onChange}
        isChoose={isChoose}
        handleSetValue={handleSetValue}
        value={value}
      />
    </div>
  );
}

export default HinhAnh;
