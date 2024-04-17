interface IconSuccessProps {
  color?: string;
}

const IconSuccess = ({ color }: IconSuccessProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.9"
      y="0.9"
      width="22.2"
      height="22.2"
      rx="11.1"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.256 8.84714C16.551 9.1583 16.551 9.6628 16.256 9.97396L11.5672 15.153C11.2722 15.4642 10.7939 15.4642 10.4989 15.153L8.23272 12.7627C7.93772 12.4515 7.93772 11.947 8.23272 11.6359C8.52772 11.3247 9.00601 11.3247 9.30101 11.6359L11.0331 13.4628L15.1877 8.84714C15.4827 8.53598 15.961 8.53598 16.256 8.84714Z"
      fill={color}
    />
  </svg>
);

IconSuccess.defaultProps = {
  color: '#FFFFFF',
};

export default IconSuccess;
