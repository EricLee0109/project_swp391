import { ShippingStatusEnums } from "@/types/enums/HealthServiceEnums";

export interface CreateShippingInfoType {
  provider: string;
  contact_name: string;
  contact_phone: string;
  shipping_address: string;
  province: string;
  district: string;
  ward: string;
}

//Demo data for Shipping
export interface ShippingInfoType {
  shipping_id: string;
  appointment_id: string;
  tracking_number: string;
  user_name: string;
  shipping_address: string;
  provider: string;
  shipping_status: ShippingStatusEnums;
  created_at: string;
  estimated_delivery: string;
}

export interface PatchShippingStatusType {
  shipping_status: ShippingStatusEnums;
}
