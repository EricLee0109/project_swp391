import { notify } from "@/lib/toastNotify";
import { formatDate } from "@/lib/utils";
import {
  StiFormServiceValues,
  stiFormServiceSchema,
} from "@/types/schemas/FormSchemas";
import { Service, StiService } from "@/types/ServiceType/HealthServiceType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Hospital } from "lucide-react";
import { useForm } from "react-hook-form";

// --- FORM FOR 'TESTING' TYPE ---
export function StiTestBookingForm({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const form = useForm<StiFormServiceValues>({
    resolver: zodResolver(stiFormServiceSchema),
    defaultValues: {
      serviceId: service.service_id,
      selected_mode: service.available_modes[0] || "AT_CLINIC",
    },
  });

  const selectedMode = form.watch("selected_mode");

  function onSubmit(data: StiFormServiceValues) {
    const payload: StiService = {
      ...data,
      location: service.return_address || "",
      date: formatDate(data.date),
      category: "STI",
    };
    console.log("Submitting STI Test Appointment:", payload);
    notify("success", "STI Test booked successfully!");
    onClose();
  }

  return (
    <div className="form-container">
      <div className="form-container-inner">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Book STI Test: {service.name}
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-3"
        >
          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="font-semibold">Service Mode</label>
            <div className="flex gap-4">
              {service.available_modes.map((mode) => (
                <label
                  key={mode}
                  className={`flex items-center gap-2 p-4 border rounded-lg cursor-pointer flex-1 ${
                    selectedMode === mode ? "border-teal-500 bg-teal-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    {...form.register("selected_mode")}
                    value={mode}
                    className="hidden"
                  />
                  {mode === "AT_CLINIC" ? (
                    <Hospital size={20} />
                  ) : (
                    <Home size={20} />
                  )}
                  <span>{mode === "AT_CLINIC" ? "At Clinic" : "At Home"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date and Session */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="date" className="font-semibold">
                Date
              </label>
              <input
                id="date"
                type="date"
                {...form.register("date", { valueAsDate: true })}
                className="w-full p-2 border rounded-md"
              />
              {form.formState.errors.date && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="font-semibold">Session</label>
              <select
                {...form.register("session")}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a session</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </select>
              {form.formState.errors.session && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.session.message}
                </p>
              )}
            </div>
          </div>

          {/* Conditional Fields */}
          {/* {selectedMode === "AT_CLINIC" && (
            <div className="space-y-2">
              <label htmlFor="location" className="font-semibold">
                Clinic Location
              </label>
              <input
                id="location"
                {...form.register("location")}
                placeholder="e.g., 123 Health St, Medtown"
                className="w-full p-2 border rounded-md"
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          )} */}

          {selectedMode === "AT_HOME" && (
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-4">
                At-Home Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact_name" className="font-semibold">
                    Contact Name
                  </label>
                  <input
                    id="contact_name"
                    {...form.register("contact_name")}
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.contact_name && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contact_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="font-semibold">
                    Contact Phone
                  </label>
                  <input
                    id="contact_phone"
                    {...form.register("contact_phone")}
                    className="w-full p-2 border rounded-md"
                  />
                  {form.formState.errors.contact_phone && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.contact_phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="shipping_address" className="font-semibold">
                  Shipping Address
                </label>
                <input
                  id="shipping_address"
                  {...form.register("shipping_address")}
                  placeholder="123 Main St"
                  className="w-full p-2 border rounded-md"
                />
                {form.formState.errors.shipping_address && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.shipping_address.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 shadow-lg"
          >
            Book Test
          </button>
        </form>
      </div>
    </div>
  );
}
