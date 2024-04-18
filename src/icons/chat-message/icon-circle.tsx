interface IconCircleProps {
  className?: string;
}

const IconCircle = ({ className }: IconCircleProps) => {
  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="9.42871" cy="10" r="8.87939" stroke="currentColor" />
    </svg>
  );
};

export default IconCircle;
