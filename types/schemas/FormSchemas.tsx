import { z } from "zod";

export const stiFormServiceSchema = z.object({
  serviceId: z.string().min(1, "Vui lòng nhập ID dịch vụ"),
  selected_mode: z.enum(["AT_HOME", "AT_CLINIC"], {
    errorMap: () => ({ message: "Vui lòng chọn hình thức dịch vụ" }),
  }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải có định dạng YYYY-MM-DD"),
  session: z.enum(["morning", "afternoon"], {
    errorMap: () => ({ message: "Vui lòng chọn buổi" }),
  }),
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
shipping_address: z.string()
  .min(1, "Địa chỉ không được để trống")
  .max(255, "Địa chỉ quá dài"),
  province: z.string().min(2, { message: "Province is required." }),
  district: z.string().min(2, { message: "District is required." }),
  ward: z.string().min(2, { message: "Ward is required." }),
  // We'll pass this in separately, not as a form field
  appointment_id: z.string(),
});

export const menstrualCycleSetupSchema = z
  .object({
    lastCycleStartDate: z.date({ message: "Last Date is required." }),
    lastPeriodLength: z
      .number()
      .min(2, "Nhiều hơn 2 ngày")
      .max(7, "Ít hơn 7 ngày"),
    // lastPeriodLength: z
    //   .union([z.string(), z.number()])
    //   .transform((val) => Number(val)),

    prevCycleStartDate: z.date({ message: "Previous Date is required." }),
    prevPeriodLength: z
      .number()
      .min(2, "Nhiều hơn 2 ngày")
      .max(7, "Ít hơn 7 ngày"),
  })
  .refine((data) => data.lastCycleStartDate > data.prevCycleStartDate, {
    message: "Chu kỳ gần nhất phải có số ngày lớn hơn chu kỳ trước đó",
    path: ["lastCycleStartDate"],
  });
export const commentSchema = z.object({
  content: z.string().min(1, "Nội dung không được để trống"),
  parent_id: z.string().optional(),
});

export type StiFormServiceValues = z.infer<typeof stiFormServiceSchema>;
export type ShippingFormValues = z.infer<typeof createShippingSchema>;
export type MenstrualCycleSetupValues = z.infer<
  typeof menstrualCycleSetupSchema
>;
export type CommentFormValues = z.infer<typeof commentSchema>;
