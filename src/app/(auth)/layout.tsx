export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
