import { CoreBlock } from '@/app/components/CoreBlock'
import { FunctionComponent } from 'react'

interface Props {
  title: string
  label: string
  items: {
    title: string
    label: string
    icon: {
      src: string
    }
  }[]
}

export const Stack: FunctionComponent<Props> = ({ title, label, items }) => {
  return (
    <CoreBlock>
      <h2 className="text-2xl font-medium text-system-label-primary">
        {title}
      </h2>
      <p className="text-md text-system-label-secondary">{label}</p>

      <div className="flex flex-col gap-6 mt-6">
        {items.map((item) => {
          return (
            <div key={item.title} className="flex items-center gap-4">
              <img
                src={item.icon.src}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="font-medium text-system-label-primary text-lg mb-0">
                  {item.title}
                </h3>
                <p className="text-system-label-secondary -mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </CoreBlock>
  )
}
