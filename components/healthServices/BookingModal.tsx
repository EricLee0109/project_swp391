import { formatDate } from "@/lib/utils";
import { AvailableMode } from "@/types/enums/HealthServiceEnums";
import {
  Consultant,
  CreateAppointmentDto,
  Schedule,
  Service,
} from "@/types/ServiceType/HealthServiceType";
import { ArrowLeft, Home, Hospital, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// --- BOOKING MODAL ---
export function BookingModal({
  service,
  consultants,
  schedules,
  onClose,
}: {
  service: Service;
  consultants: Consultant[];
  schedules: Schedule[];
  onClose: () => void;
}) {
  const sonner = toast;
  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState<Partial<CreateAppointmentDto>>(
    {
      service_id: service.service_id,
      type: service.type,
      related_appointment_id: null,
    }
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleLocationSelect = (location: AvailableMode) => {
    setAppointment((prev) => ({
      ...prev,
      location: location === "AT_HOME" ? "At Home" : "At Clinic",
    }));
    setStep(2);
  };

  const handleConsultantSelect = (consultant: Consultant) => {
    setAppointment((prev) => ({
      ...prev,
      consultant_id: consultant.consultant_id,
    }));
    setStep(3);
  };

  const handleScheduleSelect = (schedule: Schedule, time: string) => {
    setAppointment((prev) => ({ ...prev, schedule_id: schedule.schedule_id }));
    setSelectedTime(time);
    setSelectedDate(schedule.date);
    setStep(4);
  };

  const createAppointment = () => {
    console.log("Creating appointment:", appointment);
    sonner.success("Appointment created successfully!");
    onClose();
  };

  const selectedConsultant = consultants.find(
    (c) => c.consultant_id === appointment.consultant_id
  );
  const consultantSchedules = schedules.filter(
    (s) => s.consultant_id === appointment.consultant_id
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none"
        >
          &times;
        </button>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {step === 1 && service.available_modes.length > 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Choose Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.available_modes.map((mode) => (
                <div
                  key={mode}
                  onClick={() => handleLocationSelect(mode)}
                  className="cursor-pointer p-6 border rounded-lg text-center hover:bg-gray-100 transition"
                >
                  {mode === "AT_CLINIC" ? (
                    <Hospital className="mx-auto mb-2" size={32} />
                  ) : (
                    <Home className="mx-auto mb-2" size={32} />
                  )}
                  <p className="font-semibold">
                    {mode === "AT_CLINIC" ? "At Clinic" : "At Home"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(step === 2 ||
          (step === 1 && service.available_modes.length <= 1)) && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Choose a Consultant
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {consultants.map((c) => (
                <div
                  key={c.consultant_id}
                  onClick={() => handleConsultantSelect(c)}
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  {/* In real data use Image form Next to secure! */}
                  {/* <Image
                    src={c.user.avatar || "/default-avatar.png"}
                    alt={c.user.full_name || ""}
                    className="w-12 h-12 rounded-full mr-4"
                  /> */}
                  <img
                    src={c.user.avatar || "/default-avatar.png"}
                    alt={c.user.full_name || ""}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{c.user.full_name}</p>
                      {c.is_verified && (
                        <ShieldCheck size={16} className="text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{c.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedConsultant && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Select a Schedule
            </h2>
            <h3 className="text-lg font-semibold text-center mb-4">
              {selectedConsultant.user.full_name}
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {consultantSchedules.length > 0 ? (
                consultantSchedules.map((s) => (
                  <div key={s.schedule_id} className="p-4 border rounded-lg">
                    <p className="font-bold mb-2">
                      {formatDate(new Date(s.date))}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.time_slots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleScheduleSelect(s, time)}
                          className="px-4 py-2 bg-teal-100 text-teal-800 rounded-md hover:bg-teal-200"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No available schedules for this consultant.
                </p>
              )}
            </div>
          </div>
        )}

        {step === 4 && selectedConsultant && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Confirm Appointment
            </h2>
            <div className="space-y-3 text-gray-700 p-4 bg-gray-50 rounded-lg border">
              <p>
                <strong>Service:</strong> {service.name}
              </p>
              <p>
                <strong>Location:</strong> {appointment.location || "At Clinic"}
              </p>
              <p>
                <strong>Consultant:</strong> {selectedConsultant.user.full_name}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(new Date(selectedDate))}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
            </div>
            <button
              onClick={createAppointment}
              className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
