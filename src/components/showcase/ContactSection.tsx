"use client"

import { useState } from "react"
import { Mail, MessageSquare, Clock, Send } from "lucide-react"
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

export function ContactSection() {
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
    <section className="border-t bg-muted/30 py-6 sm:py-16 lg:py-32">
      <div className="container max-w-6xl">
        <div className="mb-6 sm:mb-10 lg:mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to build something great?</h2>
          <p className="mt-4 text-lg text-muted-foreground mx-auto max-w-2xl">
            Have a project in mind? We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="flex flex-col items-center max-w-4xl mx-auto">
          <div className="grid gap-4 sm:gap-8 sm:grid-cols-3 w-full mb-6 sm:mb-12">
            {sideCards.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="rounded-xl bg-primary/5 p-4 text-primary ring-1 ring-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="w-full shadow-xl border-muted-foreground/10 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send a message
              </CardTitle>
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
                  className="space-y-6"
                >
                  <FormStatus error={serverError} />

                  <div className="grid gap-6 sm:grid-cols-2">
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
                        className="bg-background/50"
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
                        className="bg-background/50"
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
                      className="bg-background/50"
                    />
                  </FormField>

                  <FormField
                    id="message"
                    label="Message"
                    error={fieldErrors.message}
                    required
                  >
                    <Textarea
                      id="message"
                      placeholder="Tell us what's on your mind…"
                      rows={5}
                      maxLength={2000}
                      value={form.message}
                      onChange={set("message")}
                      className="bg-background/50 resize-none"
                    />
                    <p className="text-right text-[10px] text-muted-foreground mt-1">
                      {form.message.length}/2000
                    </p>
                  </FormField>

                  <div className="flex justify-end pt-2">
                    <SubmitButton
                      loading={loading}
                      loadingText="Sending…"
                      className="w-full sm:w-auto px-8 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
                    >
                      Send message
                    </SubmitButton>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
