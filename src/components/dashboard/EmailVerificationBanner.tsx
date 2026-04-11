"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EmailVerificationBanner() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [resendError, setResendError] = useState("")
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "error">("idle")
  const [verifyError, setVerifyError] = useState("")

  async function handleResend() {
    setResendStatus("loading")
    setResendError("")
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" })
      if (res.ok) {
        setResendStatus("sent")
      } else {
        const data = await res.json()
        setResendError(data.error ?? "Failed to send — try again")
        setResendStatus("error")
      }
    } catch {
      setResendError("Something went wrong. Please try again.")
      setResendStatus("error")
    }
  }

  async function handleVerify() {
    if (!code.trim()) return
    setVerifyStatus("loading")
    setVerifyError("")
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      if (res.ok) {
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

  return (
    <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
      <p className="font-medium">Verify your email address</p>
      <p className="mt-1 text-yellow-700">
        Enter the 6-digit code we sent to your email.
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className="w-32 border-yellow-300 bg-white text-center font-mono tracking-widest text-yellow-900"
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <Button
          size="sm"
          onClick={handleVerify}
          disabled={verifyStatus === "loading" || code.length !== 6}
          className="bg-yellow-700 text-white hover:bg-yellow-800"
        >
          {verifyStatus === "loading" ? "Verifying..." : "Verify"}
        </Button>
      </div>

      {verifyError && (
        <p className="mt-2 text-xs text-red-600">{verifyError}</p>
      )}

      <div className="mt-3 space-y-1">
        {resendStatus === "sent" ? (
          <p className="text-xs text-yellow-700">Code sent! Check your inbox.</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendStatus === "loading"}
            className="text-xs text-yellow-700 underline underline-offset-2 hover:text-yellow-900 disabled:opacity-50"
          >
            {resendStatus === "loading" ? "Sending..." : "Resend code"}
          </button>
        )}
        {resendStatus === "error" && resendError && (
          <p className="text-xs text-red-600">{resendError}</p>
        )}
      </div>
    </div>
  )
}
