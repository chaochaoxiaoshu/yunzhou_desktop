interface LogoProps {
  size: number
}

function Logo(props: LogoProps): JSX.Element {
  const { size } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 49 49"
    >
      <path
        fill="url(#paint0_linear_1001_2)"
        fillRule="evenodd"
        d="M24.5 0a24.442 24.442 0 0110.264 2.258L24.5 20.07 14.236 2.258A24.373 24.373 0 0119.246.57 24.44 24.44 0 0124.5 0zm2.168 49a24.385 24.385 0 006.612-1.534 24.373 24.373 0 005.016-2.631 24.582 24.582 0 005.025-4.57 24.575 24.575 0 002.553-27.716 24.958 24.958 0 00-1.59-2.48A24.595 24.595 0 0039.706 5.3a24.45 24.45 0 00-1.181-.88L26.668 24.997V49zm-4.336 0a24.385 24.385 0 01-6.612-1.534 24.373 24.373 0 01-5.016-2.631 24.607 24.607 0 01-4.278-3.715 24.594 24.594 0 01-4.328-6.632A24.59 24.59 0 015.62 8.905a24.556 24.556 0 014.856-4.485l11.857 20.577V49z"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_1001_2"
          x1="49"
          x2="0"
          y1="24.5"
          y2="24.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#42FBF5"></stop>
          <stop offset="1" stopColor="#6A85F4"></stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Logo
