import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

/**
 * A Button pre-wired for form submission.
 * - type="submit" by default
 * - Disabled and shows a spinner while loading
 * - Accepts a loadingText label to make the state change accessible
 */
export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(({ loading = false, loadingText, children, disabled, ...props }, ref) => (
  <Button
    ref={ref}
    type="submit"
    disabled={loading || disabled}
    aria-disabled={loading || disabled}
    {...props}
  >
    {loading && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
    )}
    <span>{loading && loadingText ? loadingText : children}</span>
  </Button>
))
SubmitButton.displayName = "SubmitButton"
