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
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
    {props.children}
  </svg>
);

SvgComponent.propTypes = {
  width: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
};

export default SvgComponent;
