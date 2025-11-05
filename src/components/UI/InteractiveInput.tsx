import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Search, X, Check, Loader2 } from 'lucide-react'

interface InteractiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  showClearButton?: boolean
  showSuccessIndicator?: boolean
  loading?: boolean
  suggestions?: string[]
  onSuggestionSelect?: (suggestion: string) => void
  validateOnBlur?: (value: string) => string | null
  debounceMs?: number
  className?: string
  inputClassName?: string
}

export function InteractiveInput({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  showClearButton = true,
  showSuccessIndicator = true,
  loading = false,
  suggestions = [],
  onSuggestionSelect,
  validateOnBlur,
  debounceMs = 300,
  className = '',
  inputClassName = '',
  value,
  onChange,
  onBlur,
  onFocus,
  type = 'text',
  ...props
}: InteractiveInputProps) {
  const [internalValue, setInternalValue] = useState(value || '')
  const [showPassword, setShowPassword] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Handle controlled/uncontrolled state
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(value || '')
    }
  }, [value, isControlled])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (!isControlled) {
      setInternalValue(newValue)
    }

    // Clear validation error when user types
    if (validationError) {
      setValidationError(null)
      setIsValid(null)
    }

    // Debounce change callback
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onChange?.(e)
    }, debounceMs)

    // Show suggestions if available
    if (suggestions.length > 0 && newValue.length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setShowSuggestions(false)

    // Validation
    if (validateOnBlur) {
      const error = validateOnBlur(currentValue as string)
      setValidationError(error)
      setIsValid(!error && currentValue !== '')
    }

    onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleClear = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>

    if (!isControlled) {
      setInternalValue('')
    }

    setValidationError(null)
    setIsValid(null)
    setShowSuggestions(false)
    onChange?.(event)
  }

  const handleSuggestionClick = (suggestion: string) => {
    const event = {
      target: { value: suggestion }
    } as React.ChangeEvent<HTMLInputElement>

    if (!isControlled) {
      setInternalValue(suggestion)
    }

    setShowSuggestions(false)
    onChange?.(event)
    onSuggestionSelect?.(suggestion)
  }

  const getInputType = () => {
    if (showPasswordToggle && type === 'password') {
      return showPassword ? 'text' : 'password'
    }
    return type
  }

  const hasError = error || validationError
  const hasSuccess = success || (isValid && showSuccessIndicator && currentValue !== '')

  return (
    <div className={cn('relative', className)}>
      {/* Label */}
      {label && (
        <label className={cn(
          'block text-sm font-medium mb-2 transition-colors',
          hasError ? 'text-red-400' : hasSuccess ? 'text-green-400' : 'text-gray-300',
          isFocused && 'text-blue-400'
        )}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <Input
          ref={inputRef}
          type={getInputType()}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            'pr-20 transition-all duration-200',
            leftIcon && 'pl-10',
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            hasSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
            isFocused && 'ring-2 ring-blue-500/20 border-blue-500',
            inputClassName
          )}
          {...props}
        />

        {/* Right Side Icons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}

          {hasSuccess && !loading && (
            <Check className="h-4 w-4 text-green-500" />
          )}

          {showClearButton && currentValue && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {showPasswordToggle && type === 'password' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          )}

          {rightIcon && !loading && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 animate-fade-in-up">
            {suggestions
              .filter(s => s.toLowerCase().includes((currentValue as string).toLowerCase()))
              .slice(0, 5)
              .map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-3 w-3 text-gray-500" />
                    <span>{suggestion}</span>
                  </div>
                </button>
              ))
            }
          </div>
        )}
      </div>

      {/* Helper Text / Error / Success Messages */}
      {(helperText || hasError || hasSuccess) && (
        <div className="mt-1 text-sm animate-fade-in">
          {hasError && (
            <p className="text-red-400 flex items-center gap-1">
              <X className="h-3 w-3" />
              {error || validationError}
            </p>
          )}
          {hasSuccess && (
            <p className="text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              {success}
            </p>
          )}
          {helperText && !hasError && !hasSuccess && (
            <p className="text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
}