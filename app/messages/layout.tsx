import { NotificationListener } from "@/components/shared/NotificationListener";

export default function MessagesLayout({
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