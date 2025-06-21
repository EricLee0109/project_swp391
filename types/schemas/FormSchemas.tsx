import { z } from "zod";

export const stiFormServiceSchema = z
  .object({
    serviceId: z.string(),
    date: z.date({ required_error: "A date is required." }),
    session: z.enum(["morning", "afternoon"], {
      required_error: "Please select a session.",
    }),
    selected_mode: z.enum(["AT_HOME", "AT_CLINIC"]),
    location: z.string().optional(),
    contact_name: z.string().optional(),
    contact_phone: z.string().optional(),
    shipping_address: z.string().optional(),
  })
  //   .refine(
  //     (data) => {
  //       if (data.selected_mode === "AT_CLINIC") return !!data.location;
  //       return true;
  //     },
  //     { message: "Location is required for clinic visits.", path: ["location"] }
  //   )
  .refine(
    (data) => {
      if (data.selected_mode === "AT_HOME") return !!data.contact_name;
      return true;
    },
    {
      message: "Contact name is required for home visits.",
      path: ["contact_name"],
    }
  )
  .refine(
    (data) => {
      if (data.selected_mode === "AT_HOME") return !!data.contact_phone;
      return true;
    },
    {
      message: "Contact phone is required for home visits.",
      path: ["contact_phone"],
    }
  )
  .refine(
    (data) => {
      if (data.selected_mode === "AT_HOME") return !!data.shipping_address;
      return true;
    },
    {
      message: "Shipping address is required for home visits.",
      path: ["shipping_address"],
    }
  );

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
