interface IconWarningProps {
  color?: string;
}

const IconWarning = ({ color = '#FFFFFF' }: IconWarningProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g mask="url(#mask0_19800_15251)">
      <path
        d="M16 21.2336C16.1781 21.2336 16.3392 21.1669 16.4832 21.0336C16.6283 20.9003 16.7008 20.7333 16.7008 20.5328C16.7008 20.3557 16.6283 20.2005 16.4832 20.0672C16.3392 19.9339 16.1781 19.8672 16 19.8672C15.8219 19.8672 15.6608 19.9339 15.5168 20.0672C15.3717 20.2005 15.2992 20.3557 15.2992 20.5328C15.2992 20.7333 15.3717 20.9003 15.5168 21.0336C15.6608 21.1669 15.8219 21.2336 16 21.2336ZM15.4672 18.2H16.5328V10.0992H15.4672V18.2ZM11.9328 25.8672L6.13281 20.0336V11.9328L11.9328 6.13281H20.0672L25.8672 11.9328V20.0672L20.0336 25.8672H11.9328ZM12.3664 24.8H19.6336L24.8 19.6336V12.3664L19.6 7.20001H12.3664L7.20001 12.3664V19.6336L12.3664 24.8Z"
        fill={color}
      />
    </g>
  </svg>
);

export default IconWarning;
