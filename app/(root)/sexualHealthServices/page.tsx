import { ServiceBrowser } from "@/components/healthServices/ServicesBrowser";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";

export default function SexualHealthServicesPage() {
  return (
    <MaxWidthWrapper>
      <div className="min-h-screen font-sans">
        <main className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
              Sexual Health Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Confidential, professional, and compassionate care for your sexual
              health and well-being.
            </p>
          </header>

          {/* The stateful, interactive part is delegated to a Client Component */}
          <ServiceBrowser />
        </main>
      </div>
    </MaxWidthWrapper>
  );
}
