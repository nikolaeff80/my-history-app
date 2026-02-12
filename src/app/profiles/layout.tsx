import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProfilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
