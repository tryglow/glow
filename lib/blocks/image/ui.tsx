import { CoreBlock } from '@/app/components/CoreBlock'
import { FunctionComponent } from 'react'

interface Props {
  src: string
}

export const Image: FunctionComponent<Props> = ({ src }) => {
  return (
    <CoreBlock className="relative p-0 overflow-hidden">
      <img src={src} className="absolute w-full h-full object-cover" />
    </CoreBlock>
  )
}
