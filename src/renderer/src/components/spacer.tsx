interface SpacerProps {
  width?: number
  height?: number
}

export default function Spacer(props: SpacerProps): JSX.Element {
  const { width, height } = props
  return (
    <div
      style={{
        width: width ? `${width / 16}rem` : '',
        height: height ? `${height / 16}rem` : ''
      }}
    ></div>
  )
}
