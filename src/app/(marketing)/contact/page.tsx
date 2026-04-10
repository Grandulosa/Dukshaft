"use client"

import { useState } from "react"
import type { Metadata } from "next"
import { Mail, MessageSquare, Clock } from "lucide-react"
import { contactSchema, type ContactInput } from "@/lib/validations/contact"
import { useFormSubmit } from "@/hooks/useFormSubmit"
import { toast } from "@/hooks/useToast"
import { FormField } from "@/components/ui/form-field"
import { FormStatus } from "@/components/ui/form-status"
import { SubmitButton } from "@/components/ui/submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const EMPTY: ContactInput = { name: "", email: "", subject: "", message: "" }

const sideCards = [
  {
    icon: Mail,
    title: "Email us",
    body: "hello@dukshaft.studio",
  },
  {
    icon: Clock,
    title: "Response time",
    body: "We respond within 1–2 business days.",
  },
  {
    icon: MessageSquare,
    title: "Chat",
    body: "Live chat is coming soon.",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState<ContactInput>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  function set(field: keyof ContactInput) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function validate(data: ContactInput): Record<string, string> | null {
    const result = contactSchema.safeParse(data)
    if (result.success) return null
    const errs: Record<string, string> = {}
    result.error.errors.forEach((e) => {
      const f = e.path[0] as string
      if (!errs[f]) errs[f] = e.message
    })
    return errs
  }

  const { loading, serverError, fieldErrors, handleSubmit } =
    useFormSubmit<ContactInput>({
      validate,
      onSubmit: async (data) => {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        const json = await res.json()

        if (!res.ok) {
          // Surface server field errors back into the form
          if (json.fieldErrors) {
            const err = new Error("Validation failed") as Error & {
              fieldErrors?: Record<string, string>
            }
            err.fieldErrors = json.fieldErrors
            throw err
          }
          throw new Error(json.error ?? "Something went wrong")
        }
      },
      onSuccess: () => {
        setSubmitted(true)
        setForm(EMPTY)
        toast({
          variant: "success" as never,
          title: "Message sent!",
          description:
            "We received your message and will reply within 1–2 business days.",
        })
      },
    })

  return (
    <div className="container py-16 max-w-5xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Have a question or want to work together? We&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Info cards */}
        <div className="flex flex-col gap-4">
          {sideCards.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
            <CardDescription>
              All fields marked <span className="text-destructive">*</span> are
              required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted && (
              <FormStatus
                showSuccess
                successTitle="Message received"
                successMessage="We'll be in touch within 1–2 business days."
              />
            )}

            {!submitted && (
              <form
                onSubmit={(e) => handleSubmit(e, form)}
                noValidate
                className="space-y-5"
              >
                <FormStatus error={serverError} />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="name"
                    label="Name"
                    error={fieldErrors.name}
                    required
                  >
                    <Input
                      id="name"
                      placeholder="Jane Smith"
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                    />
                  </FormField>

                  <FormField
                    id="email"
                    label="Email"
                    error={fieldErrors.email}
                    required
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={set("email")}
                    />
                  </FormField>
                </div>

                <FormField
                  id="subject"
                  label="Subject"
                  error={fieldErrors.subject}
                  required
                >
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={set("subject")}
                  />
                </FormField>

                <FormField
                  id="message"
                  label="Message"
                  error={fieldErrors.message}
                  description="Minimum 20 characters."
                  required
                >
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind…"
                    rows={6}
                    maxLength={2000}
                    value={form.message}
                    onChange={set("message")}
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {form.message.length}/2000
                  </p>
                </FormField>

                <SubmitButton
                  loading={loading}
                  loadingText="Sending…"
                  className="w-full sm:w-auto"
                >
                  Send message
                </SubmitButton>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
