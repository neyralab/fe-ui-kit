interface IconNotificationProps {
  color?: string;
}

const IconNotification = ({ color }: IconNotificationProps) => (
  <svg
    width="18"
    height="24"
    viewBox="0 0 18 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 13.2133V4.5C14 4.3672 13.9473 4.24022 13.8535 4.14647L9.8535 0.146484C9.75975 0.0527344 9.63281 0 9.49997 0H1.99997C0.897469 0 0 0.896953 0 2.00002V17C0 18.103 0.897469 19 2.00002 19H7.02534C7.27917 21.7989 9.63652 24 12.5 24C15.5322 24 18 21.5327 18 18.5C18 15.9878 16.3048 13.8685 14 13.2133ZM9.99998 1.70705L12.293 4.00003H11C10.4482 4.00003 10 3.5513 10 3.00005V1.70705H9.99998ZM2.00002 18C1.44825 18 1.00003 17.5513 1.00003 17V2.00002C1.00003 1.44877 1.4483 1.00003 2.00002 1.00003H9V3C9 4.10302 9.89747 5.00002 11 5.00002H13V13.0253C12.8351 13.0104 12.6688 13 12.5 13C9.63656 13 7.27917 15.2011 7.02534 18H2.00002V18ZM12.5 23C10.0185 23 8.00002 20.9814 8.00002 18.5C8.00002 16.0186 10.0186 14 12.5 14C14.9814 14 17 16.0186 17 18.5C17 20.9814 14.9814 23 12.5 23Z"
      fill={color}
    />
    <path
      d="M14.6465 16.6465L11.5 19.793L10.3535 18.6465C10.1582 18.4512 9.84178 18.4512 9.6465 18.6465C9.45117 18.8418 9.45117 19.1582 9.6465 19.3535L11.1465 20.8535C11.2441 20.9512 11.3721 21 11.5 21C11.628 21 11.7559 20.9512 11.8536 20.8535L15.3536 17.3535C15.5489 17.1582 15.5489 16.8418 15.3536 16.6465C15.1582 16.4512 14.8418 16.4512 14.6465 16.6465Z"
      fill={color}
    />
  </svg>
);

IconNotification.defaultProps = {
  color: '#FFFFFF',
};

export default IconNotification;
