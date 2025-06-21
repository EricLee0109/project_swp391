"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createShippingSchema } from "@/types/schemas/FormSchemas"; // Import our schema
import { notify } from "@/lib/toastNotify";
import { Input } from "@/components/ui/input";

type ShippingFormValues = z.infer<typeof createShippingSchema>;

interface CreateShippingFormProps {
  appointmentId: string;
  onFormSubmit: () => void; // Function to close dialog on success
}

export function CreateShippingForm({
  appointmentId,
  onFormSubmit,
}: CreateShippingFormProps) {
  const router = useRouter();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(createShippingSchema),
    defaultValues: {
      provider: "GHTK", // Default provider
      contact_name: "",
      contact_phone: "",
      shipping_address: "",
      province: "",
      district: "",
      ward: "",
      appointment_id: appointmentId,
    },
  });

  async function onSubmit(data: ShippingFormValues) {
    try {
      // TODO: Replace with your actual API endpoint call
      const response = await fetch(`/api/shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create shipping info.");
      }

      notify("success", "Shipping information has been created.");

      onFormSubmit(); // Close the dialog
      router.refresh(); // Refresh data on the appointments page
    } catch (error) {
      notify("error", (error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Fields... */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị vận chuyển</FormLabel>
                <FormControl>
                  <Input placeholder="GHTK" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyen Van A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="09xxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="shipping_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ giao hàng</FormLabel>
                <FormControl>
                  <Input placeholder="Buoi Van Ba" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- Location Details (3 columns for Province, District, Ward) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province / City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., TP. Hồ Chí Minh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quận 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Phường Bến Nghé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Add all other FormField components here in the same pattern */}
        </div>
        <Button type="submit">Create Shipment</Button>
      </form>
    </Form>
  );
}

// NOTE: To save space, the full code for all 7 FormField components is omitted here.
// You would repeat the pattern below for each field in your form.

/* Example for one FormField */
/*
<FormField
  control={form.control}
  name="provider"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Shipping Provider</FormLabel>
      <FormControl>
        <Input placeholder="e.g., Giao Hàng Nhanh" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
*/
