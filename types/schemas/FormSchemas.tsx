import { z } from "zod";

export const stiFormServiceSchema = z.object({
  serviceId: z.string().min(1, "Vui lòng nhập ID dịch vụ"),
  selected_mode: z.enum(["AT_HOME", "AT_CLINIC"], { errorMap: () => ({ message: "Vui lòng chọn hình thức dịch vụ" }) }),
  date: z.date({ required_error: "Vui lòng chọn ngày" }),
  session: z.enum(["morning", "afternoon"], { errorMap: () => ({ message: "Vui lòng chọn buổi" }) }),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  shipping_address: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
});

export const createShippingSchema = z.object({
  provider: z.string().min(2, { message: "Provider is required." }),
  contact_name: z.string().min(2, { message: "Contact name is required." }),
  contact_phone: z.string().regex(/^(\+84|0[35789])[0-9]{8}$/, {
    message: "Invalid Vietnamese phone number.",
  }),
  shipping_address: z
    .string()
    .min(10, { message: "Full address is required." }),
  province: z.string().min(2, { message: "Province is required." }),
  district: z.string().min(2, { message: "District is required." }),
  ward: z.string().min(2, { message: "Ward is required." }),
  // We'll pass this in separately, not as a form field
  appointment_id: z.string(),
});

export type StiFormServiceValues = z.infer<typeof stiFormServiceSchema>;
export type ShippingFormValues = z.infer<typeof createShippingSchema>;
