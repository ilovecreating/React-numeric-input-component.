import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type {
  ChangeEvent,
  InputHTMLAttributes,
} from 'react'

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'inputMode'
>

export interface NumericInputProps extends NativeInputProps {
  value: number | null | undefined
  onChange: (value: number | null) => void
  minWidth?: number
}

const NON_DIGIT = /\D/g

const stripNonDigits = (input: string): string => input.replace(NON_DIGIT, '')

const formatDigits = (digits: string): string =>
  digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''

const valueToDigits = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return ''
  return String(Math.trunc(Math.abs(value)))
}

const INPUT_CLASSES =
  'box-border border border-[#CFCADF] rounded-md ' +
  'pl-[8px] py-1.5 text-lg font-medium text-gray-900 ' +
  'placeholder:text-gray-300 placeholder:font-normal ' +
  'bg-white outline-none transition-colors ' +
  'focus:border-[#906FEE]'

const MEASURE_CLASSES =
  'invisible absolute left-0 top-0 whitespace-pre ' +
  'box-border border border-transparent rounded-md ' +
  'px-3 py-1.5 text-lg font-medium'

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  function NumericInput(
    {
      value,
      onChange,
      minWidth = 72,
      className = '',
      placeholder,
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => inputRef.current!, [])

    const measureRef = useRef<HTMLSpanElement>(null)
    const [width, setWidth] = useState(minWidth)
    const pendingDigitPosRef = useRef<number | null>(null)

    const display = formatDigits(valueToDigits(value))

    useLayoutEffect(() => {
      const el = measureRef.current
      if (!el) return
      const measured = Math.ceil(el.getBoundingClientRect().width)
      setWidth(Math.max(minWidth, measured))
    }, [display, placeholder, minWidth])

    useLayoutEffect(() => {
      const target = pendingDigitPosRef.current
      const el = inputRef.current
      if (target == null || !el || document.activeElement !== el) return
      pendingDigitPosRef.current = null

      const formatted = el.value
      let digitCount = 0
      let pos = 0
      while (pos < formatted.length && digitCount < target) {
        const code = formatted.charCodeAt(pos)
        if (code >= 48 && code <= 57) digitCount += 1
        pos += 1
      }
      el.setSelectionRange(pos, pos)
    }, [display])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const cursorPos = e.target.selectionStart ?? raw.length
      pendingDigitPosRef.current = stripNonDigits(raw.slice(0, cursorPos)).length

      const digits = stripNonDigits(raw)
      onChange(digits === '' ? null : Number(digits))
    }

    return (
      <span className="relative inline-block leading-none align-middle">
        <span ref={measureRef} aria-hidden className={MEASURE_CLASSES}>
          {display || placeholder || ''}
        </span>
        <input
          ref={inputRef}
          {...rest}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={display}
          placeholder={placeholder}
          onChange={handleChange}
          style={{ width }}
          className={`${INPUT_CLASSES} ${className}`.trim()}
        />
      </span>
    )
  },
)
