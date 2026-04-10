"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "error">("idle")
  const [verifyError, setVerifyError] = useState("")
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")

  async function handleVerify() {
    if (code.length !== 6) return
    setVerifyStatus("loading")
    setVerifyError("")
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      if (res.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        const data = await res.json()
        setVerifyError(data.error ?? "Invalid code. Please try again.")
        setVerifyStatus("error")
      }
    } catch {
      setVerifyError("Something went wrong. Please try again.")
      setVerifyStatus("error")
    }
  }

  async function handleResend() {
    setResendStatus("loading")
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" })
      setResendStatus(res.ok ? "sent" : "error")
    } catch {
      setResendStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to your email address. Enter it below to verify your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {verifyError && (
          <Alert variant="destructive">
            <AlertDescription>{verifyError}</AlertDescription>
          </Alert>
        )}

        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          placeholder="000000"
          maxLength={6}
          className="text-center font-mono tracking-widest text-lg"
          autoFocus
        />
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={verifyStatus === "loading" || code.length !== 6}
        >
          {verifyStatus === "loading" ? "Verifying…" : "Verify email"}
        </Button>

        <div className="text-sm text-muted-foreground text-center">
          {resendStatus === "sent" ? (
            <span>Code sent! Check your inbox.</span>
          ) : (
            <span>
              Didn&apos;t receive it?{" "}
              <button
                onClick={handleResend}
                disabled={resendStatus === "loading"}
                className="text-foreground underline-offset-4 hover:underline disabled:opacity-50"
              >
                {resendStatus === "loading"
                  ? "Sending…"
                  : resendStatus === "error"
                  ? "Failed — try again"
                  : "Resend code"}
              </button>
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
