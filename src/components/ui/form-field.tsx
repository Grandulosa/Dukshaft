import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  /** Matches the htmlFor of the Label to the id of the control. */
  id: string
  label: string
  error?: string
  description?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Reusable form field wrapper.
 * Composes a Label, any input control (via children), an optional description,
 * and an inline error message with the correct aria attributes applied.
 *
 * Usage:
 *   <FormField id="email" label="Email" error={errors.email}>
 *     <Input id="email" ... aria-describedby="email-desc" />
 *   </FormField>
 */
export function FormField({
  id,
  label,
  error,
  description,
  required,
  className,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`
  const descId = `${id}-desc`

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {/* Clone children to inject aria-describedby when an error is present */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        const extra: Record<string, string> = {}
        if (error) extra["aria-describedby"] = errorId
        else if (description) extra["aria-describedby"] = descId
        if (error) extra["aria-invalid"] = "true"
        return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, extra)
      })}

      {description && !error && (
        <p id={descId} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
