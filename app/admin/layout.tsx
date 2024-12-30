import { NotificationListener } from "@/components/shared/NotificationListener";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NotificationListener />
      {children}
    </>
  );
} 