export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans bg-white">
      <div className="sticky top-0 z-50 w-full border-b bg-background ">
        {/* <Navbar />
        <Nav /> */}
      </div>
      <div className="h-full max-h-max">{children}</div>
    </main>
  );
}
