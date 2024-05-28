interface DividerProps {
  color?: string
  width?: string
  height?: string
  padding?: string
}

export default function Divider(props: DividerProps): JSX.Element {
  const { color, width, height, padding } = props
  return <div style={{ color, width, height, padding }}></div>
}
