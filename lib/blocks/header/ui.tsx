import { FunctionComponent } from 'react'
import Image from 'next/image'

interface Props {
  title: string
  description: string
  avatar: {
    src: string
  }
}

export const Header: FunctionComponent<Props> = ({
  title,
  description,
  avatar,
}) => {
  return (
    <header className="py-4">
      {avatar?.src && (
        <Image
          src={avatar.src}
          alt=""
          width={80}
          height={80}
          className="mb-6 rounded-lg"
        />
      )}
      <h1 className="font-medium text-4xl mb-1 text-system-label-primary">
        {title}
      </h1>
      <p className="text-2xl text-system-label-secondary">{description}</p>
    </header>
  )
}
