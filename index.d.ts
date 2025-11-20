export interface PaymentIntent {
  agentId?: string;
  amount: number | string;
  currency?: string;
  payee: string;
  purpose?: string;
  rail?: string;
}
export interface PaymentPolicy {
  version?: string;
  allowedCurrencies?: string[];
  allowlistedPayees?: string[];
  blockUnlistedPayee?: boolean;
  maxSinglePayment?: number;
  holdThreshold?: number;
  periodRemaining?: number;
}
export interface PaymentReceipt {
  agentId: string;
  amount: string;
  currency: string;
  disposition: "ALLOW" | "HOLD" | "BLOCK";
  payee: string;
  policyVersion: string;
  purpose: string;
  rail: string;
  reasons: string[];
  receiptHash: string;
}
export function evaluatePaymentIntent(intent: PaymentIntent, policy: PaymentPolicy): PaymentReceipt;
export function canonicalize(obj: unknown): string;
