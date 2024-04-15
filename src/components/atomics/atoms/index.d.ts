export interface ButtonComponentProps {
  [key: string]: unknown
  label?: string
  color?: string
  textColor?: string
  stripeColor?: string
  outline?: string
  striped?: boolean
  default?: boolean
  background?: boolean | string
  width?: string
  minWidth?: string
  disabled?: boolean
}

export interface BorderDecoratorProps {
  [key: string]: unknown
  flipped?: boolean
  height?: string
  color?: string
  borderColor?: string
}

export interface SkeletonComponent {
  [key: string]: unknown
  width?: string
  minwidth?: string
  height?: string
  color?: string
  dotted?: boolean
  dashed?: boolean
  solid?: boolean
  double?: boolean
  groove?: boolean
  ridge?: boolean
  inset?: boolean
  outset?: boolean
}
