import ProtectedRoute from '@/components/ProtectedRoute'

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
