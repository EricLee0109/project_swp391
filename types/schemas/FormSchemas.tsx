import { z } from "zod";

export const stiFormServiceForm = z
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

export type StiFormServiceSchema = z.infer<typeof stiFormServiceForm>;
