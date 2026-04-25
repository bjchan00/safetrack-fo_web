export type MemberType = "main_viewer" | "sub_viewer" | "location";
export type MemberStatus = "active" | "inactive" | "withdrawn";
export type RegistrationChannel = "app_ios" | "app_android" | "web" | "admin";

export interface Member {
  id: string;
  member_number: number;
  phone: string;
  name: string;
  member_type: MemberType;
  status: MemberStatus;
  email?: string;
  gender?: "M" | "F";
  birth_date?: string;
  address?: string;
  registration_channel: RegistrationChannel;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  max_sub_viewers: number;
  max_location_devices: number;
  max_location_history_days: number;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  member_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  is_auto_renew: boolean;
}

export interface RegisterFormData {
  phone: string;
  password: string;
  passwordConfirm: string;
  name: string;
  email: string;
  smsCode: string;
  verifyToken: string;
  memberType: MemberType | "";
  termsAgreed: boolean;
  privacyAgreed: boolean;
  locationAgreed: boolean;
  marketingAgreed: boolean;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
}
