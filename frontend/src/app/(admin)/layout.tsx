import AuthProvider from "@/providers/auth.provider";
import TanstackProvider from "@/providers/tanstack.provider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TanstackProvider>
        <AuthProvider>{children}</AuthProvider>
      </TanstackProvider>
    </>
  );
}
