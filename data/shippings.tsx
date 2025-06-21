import { ShippingInfoType } from "@/types/ServiceType/ShippingType";

export const shippingData: ShippingInfoType[] = [
  {
    shipping_id: "SHP-001",
    appointment_id: "APP-001",
    tracking_number: "GHN-XYZ123",
    user_name: "Alice Johnson",
    shipping_address: "123 Main St, District 1, HCMC",
    provider: "Giao Hàng Nhanh",
    shipping_status: "Shipped",
    created_at: "2025-06-20T10:00:00.000Z",
    estimated_delivery: "2025-06-23T17:00:00.000Z",
  },
  {
    shipping_id: "SHP-002",
    appointment_id: "APP-002",
    tracking_number: "VTP-ABC789",
    user_name: "Bob Williams",
    shipping_address: "456 Oak Ave, District 3, HCMC",
    provider: "Viettel Post",
    shipping_status: "Pending",
    created_at: "2025-06-18T11:00:00.000Z",
    estimated_delivery: "2025-06-20T17:00:00.000Z",
  },
  {
    shipping_id: "SHP-003",
    appointment_id: "APP-003",
    tracking_number: "GHN-DEF456",
    user_name: "Charlie Brown",
    shipping_address: "789 Pine Ln, Tan Binh, HCMC",
    provider: "Giao Hàng Nhanh",
    shipping_status: "SampleCollected",
    created_at: "2025-06-21T14:00:00.000Z",
    estimated_delivery: "2025-06-24T17:00:00.000Z",
  },
];
