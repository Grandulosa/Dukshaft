"use client"

import * as React from "react"
import type { ToastProps, ToastActionElement } from "@/components/ui/toast"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type Toast = Omit<ToasterToast, "id">

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type State = { toasts: ToasterToast[] }

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(toasts: ToasterToast[]) {
  memoryState = { toasts }
  listeners.forEach((l) => l(memoryState))
}

function addToast(toast: ToasterToast) {
  const next = [toast, ...memoryState.toasts].slice(0, TOAST_LIMIT)
  dispatch(next)

  setTimeout(() => {
    dispatch(memoryState.toasts.filter((t) => t.id !== toast.id))
  }, TOAST_REMOVE_DELAY)
}

export function toast(props: Toast) {
  addToast({ ...props, id: genId(), open: true })
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const idx = listeners.indexOf(setState)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) =>
      dispatch(memoryState.toasts.filter((t) => t.id !== id)),
  }
}
