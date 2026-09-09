export interface PaymentType {
  snapToken: string;
  redirectUrl: string;
}

export interface PaymentResponse {
  message: string;
  data: PaymentType;
}
