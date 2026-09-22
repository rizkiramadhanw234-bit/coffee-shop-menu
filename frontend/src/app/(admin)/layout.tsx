import AuthProvider from "@/providers/auth.provider";
import TanstackProvider from "@/providers/tanstack.provider";
import SidebarApp from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <TanstackProvider>
          <SidebarProvider>
            <SidebarApp />
            <div className="p-4 w-full">{children}</div>
          </SidebarProvider>
        </TanstackProvider>
      </AuthProvider>
    </>
  );
}
