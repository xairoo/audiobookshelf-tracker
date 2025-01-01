import PropTypes from "prop-types";

const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ? props.width : 16}
    height={props.width ? props.width : 16}
    fill={props.color ? props.color : `#000000`}
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>
    {props.children}
  </svg>
);

SvgComponent.propTypes = {
  width: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
};

export default SvgComponent;
