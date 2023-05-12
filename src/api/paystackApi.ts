import config from '../config';

interface Metadata {
  email: string;
  name: string;
  amount: number;
}

export interface InitializePaymentArgs {
  email: string;
  amount: number;
  callback_url?: string;
  metadata: Metadata;
}

interface VerifyPaymentResponse {
  amount: number;
  reference: string;
  status: string;
  metadata: Metadata;
}

const requestInit = {
  headers: {
    'Content-Type': 'Application/json',
    authorization: `Bearer ${config.PAYSTACK_SECRET}`,
  },
};

const paystackUrl = config.PAYSTACK_URL as string;

export const initializePayment = async (paymentDetails: InitializePaymentArgs) => {
  const response = await fetch(`${paystackUrl}/transaction/initialize`, {
    method: 'POST',
    headers: requestInit.headers,
    body: JSON.stringify(paymentDetails),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return {
    ...data.data
  };
};

export const verifyPayment = async (paymentReference : VerifyPaymentResponse ) => {
  const response = await fetch(
    `${paystackUrl}/transaction/verify/${paymentReference}`,
    {
      method: 'GET',
      headers: requestInit.headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return {
    ...data.data
  };
};

