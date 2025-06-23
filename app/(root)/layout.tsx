import Footer from "@/components/share/Footer";
import Nav from "@/components/share/Nav";
import Navbar from "@/components/share/Navbar";


export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans">
      <div className="sticky top-0 z-50 w-full border-b bg-background">
        <Navbar />
        <Nav />
      </div>
      {children}
      <div>
        <Footer />
      </div>
    </main>
  );
}
