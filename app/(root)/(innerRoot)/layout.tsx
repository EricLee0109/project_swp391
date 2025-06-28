import Footer from "@/components/share/Footer";
import Nav from "@/components/share/Nav";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans bg-white">
      <div className="sticky top-0 z-50 w-full border-b bg-background ">
        <Nav />
      </div>
      <div className="h-full max-h-max">{children}</div>
      <div className="h-max">
        <Footer />
      </div>
    </main>
  );
}
