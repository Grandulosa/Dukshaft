import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface FormStatusProps {
  error?: string
  success?: string
  /** When true renders a success state, ignored if success string is set */
  showSuccess?: boolean
  successTitle?: string
  successMessage?: string
}

/**
 * Renders a server-level error Alert or a success Alert.
 * For field-level errors, use FormField instead.
 */
export function FormStatus({
  error,
  success,
  showSuccess,
  successTitle = "Done",
  successMessage,
}: FormStatusProps) {
  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (success || showSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>{successTitle}</AlertTitle>
        {(success || successMessage) && (
          <AlertDescription>{success ?? successMessage}</AlertDescription>
        )}
      </Alert>
    )
  }

  return null
}
