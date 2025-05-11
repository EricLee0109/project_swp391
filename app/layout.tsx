import Navbar from "@/app/components/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <main className="font-work-sans">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
