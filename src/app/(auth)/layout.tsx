export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4">
      {children}
    </div>
  )
}
