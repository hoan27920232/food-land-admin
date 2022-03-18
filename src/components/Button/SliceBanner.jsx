import React from "react";
import PropTypes from "prop-types";

SlideBanner.propTypes = {
  right: PropTypes.bool,
  onClickArrow : PropTypes.func,
};
SlideBanner.defaultProps = {
  right: false,
  onClickArrow: null
};
function SlideBanner(props) {
  const { right, onClickArrow } = props;
  const handleClick = () => {
    if(onClickArrow){
      onClickArrow()
    }
  }
  return (
    <div

      className={`absolute z-50 xl:p-3 p-2 rounded-full color-yellow-website hover:bg-red-700 cursor-pointer transition-all duration-300 ${
        right
          ? "top-1/2 transform-50y xl:left-10 left-6"
          : "top-1/2 transform-50y xl:right-10 right-6"
      }`}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="1em"
        height="1em"
        className={`text-2xl transform ${right ? "rotate-180" : "rotate-0"}`}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          className="uim-primary"
          d="M9.879 17.243a1 1 0 0 1-.707-1.707L12.707 12L9.172 8.464a1 1 0 0 1 1.414-1.414l4.242 4.243a1 1 0 0 1 0 1.414l-4.242 4.243a.997.997 0 0 1-.707.293z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

export default SlideBanner;
