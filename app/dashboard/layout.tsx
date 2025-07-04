// ✔️ Así debe ser
import AuthWrapper from './authWrapper'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  );
}
