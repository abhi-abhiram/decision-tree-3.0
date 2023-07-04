export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen flex-col bg-gray-100">{children}</div>;
}
