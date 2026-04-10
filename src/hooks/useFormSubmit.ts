"use client"

import { useState, useRef, useCallback } from "react"

export interface FormSubmitOptions<TData> {
  /** The async function to run on submit. Receives parsed form data. */
  onSubmit: (data: TData) => Promise<void>
  /** Called after a successful submission. */
  onSuccess?: () => void
  /** Client-side validation. Return a field→message map on failure, null on pass. */
  validate?: (data: TData) => Record<string, string> | null
  /** How long to show the success state before resetting (ms). 0 = never reset. */
  successDuration?: number
}

export interface FormSubmitState {
  loading: boolean
  success: boolean
  serverError: string
  fieldErrors: Record<string, string>
  /** Call this from your form's onSubmit handler. */
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    data: unknown
  ) => Promise<void>
  clearErrors: () => void
}

/**
 * Generic form-submission hook.
 *
 * Responsibilities:
 * - Prevents duplicate submissions (ignores calls while loading is true)
 * - Runs optional client-side validation and surfaces field errors
 * - Calls the provided async onSubmit, surfaces server errors on failure
 * - Shows a transient success state, optionally auto-resets
 */
export function useFormSubmit<TData>({
  onSubmit,
  onSuccess,
  validate,
  successDuration = 3000,
}: FormSubmitOptions<TData>): FormSubmitState {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  // Guard against duplicate in-flight submissions at the ref level
  const inFlight = useRef(false)

  const clearErrors = useCallback(() => {
    setServerError("")
    setFieldErrors({})
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>, data: unknown) => {
      e.preventDefault()
      if (inFlight.current) return

      // Client-side validation
      if (validate) {
        const errors = validate(data as TData)
        if (errors && Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          return
        }
      }

      setFieldErrors({})
      setServerError("")
      setSuccess(false)
      setLoading(true)
      inFlight.current = true

      try {
        await onSubmit(data as TData)
        setSuccess(true)
        onSuccess?.()

        if (successDuration > 0) {
          setTimeout(() => setSuccess(false), successDuration)
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong"
        setServerError(message)
      } finally {
        setLoading(false)
        inFlight.current = false
      }
    },
    [onSubmit, onSuccess, validate, successDuration]
  )

  return { loading, success, serverError, fieldErrors, handleSubmit, clearErrors }
}
