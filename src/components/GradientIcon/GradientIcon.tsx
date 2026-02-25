import type { Icon as PhosphorIconType } from '@phosphor-icons/react'
import { useId } from 'react'

interface GradientIconProps {
  icon: PhosphorIconType
  size?: string
}

export const GradientIcon = ({
  icon: PhosphorIcon,
  size = '1em',
}: GradientIconProps) => {
  const gradientId = useId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      aria-hidden="true"
      style={{ verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="23"
          x2="235"
          y1="43"
          y2="202"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-accent-light)" />
          <stop offset=".5" stopColor="var(--color-accent-regular)" />
          <stop offset="1" stopColor="var(--color-accent-dark)" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} fill={`url(#${gradientId})`}>
        <PhosphorIcon size={256} color="inherit" />
      </g>
    </svg>
  )
}
