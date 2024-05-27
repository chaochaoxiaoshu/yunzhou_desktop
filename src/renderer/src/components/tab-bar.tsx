import clsx from 'clsx'

interface TabBarProps {
  items: string[]
  currentIndex: number
  onChange: (index: number) => void
}

export default function TabBar(props: TabBarProps): JSX.Element {
  return (
    <div className="flex items-center space-x-12">
      {props.items.map((item, index) => {
        return (
          <div
            key={index}
            className={clsx(
              'pt-4 py-3 cursor-pointer border-b-[3px] border-solid ',
              props.currentIndex === index
                ? 'border-[#42FBF5] text-[#42FBF5]'
                : 'border-transparent'
            )}
            onClick={() => props.onChange(index)}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}
