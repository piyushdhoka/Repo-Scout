// Component related types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  testId?: string
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  error?: string
  helperText?: string
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  showClearButton?: boolean
  validation?: (value: string) => string | null
  debounceMs?: number
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  selected?: boolean
  loading?: boolean
}

export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  persistent?: boolean
  title?: string
  description?: string
  footer?: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export interface TooltipProps {
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  arrow?: boolean
  maxWidth?: number
}

export interface DropdownProps extends BaseComponentProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface DropdownItem {
  label: string
  value?: string
  icon?: React.ReactNode
  disabled?: boolean
  destructive?: boolean
  separator?: boolean
  action?: () => void
}

export interface TabProps {
  value: string
  label: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  badge?: string | number
  onClick?: () => void
}

export interface TabsProps extends BaseComponentProps {
  activeTab: string
  onTabChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
}

export interface TableProps extends BaseComponentProps {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  sortable?: boolean
  filterable?: boolean
  pagination?: PaginationProps
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onFilter?: (filters: Record<string, any>) => void
  onRowClick?: (row: any, index: number) => void
}

export interface TableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => React.ReactNode
  sorter?: (a: any, b: any) => number
  filter?: (value: any, filter: any) => boolean
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
  onPageChange: (page: number, pageSize?: number) => void
}

export interface ToastProps {
  id?: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
  action?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  max?: number
  showZero?: boolean
  dot?: boolean
}

export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  fallback?: string
  fallbackDelay?: number
}

export interface LoadingProps extends BaseComponentProps {
  variant?: 'spinner' | 'dots' | 'skeleton' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  overlay?: boolean
}

export interface SearchProps extends BaseComponentProps {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  onSearch?: (value: string) => void
  debounceMs?: number
  suggestions?: string[]
  showSuggestions?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  loading?: boolean
}

export interface ProgressProps extends BaseComponentProps {
  value?: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  striped?: boolean
  animated?: boolean
}

export interface SkeletonProps extends BaseComponentProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
  animated?: boolean
}

export interface CarouselProps extends BaseComponentProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showArrows?: boolean
  infinite?: boolean
  slidesToShow?: number
  slidesToScroll?: number
  centerMode?: boolean
}

export interface CarouselItem {
  id: string
  content: React.ReactNode
  image?: string
  title?: string
  description?: string
}

// Form related types
export interface FormFieldProps {
  name: string
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  component?: React.ComponentType<any>
  validation?: {
    required?: boolean
    min?: number | string
    max?: number | string
    pattern?: RegExp
    custom?: (value: any) => string | undefined
  }
  defaultValue?: any
  value?: any
  onChange?: (value: any) => void
  onBlur?: (value: any) => void
  onFocus?: (value: any) => void
}

export interface FormSectionProps extends BaseComponentProps {
  title?: string
  description?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export interface FormActionProps extends BaseComponentProps {
  type?: 'submit' | 'button' | 'reset'
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}