import api from "@/services/api";
import { useState } from "react";

type SubscriptionPayload = {
  plan_id: number;
  coupon: string | null;
  email: string;
  card_number: string;
  client_name: string;
  expire_date: string;
  cvc: string;
  card_flag_id: number;
};

interface ValidationErrors {
  [field: string]: string[];
}

export type TransactionResult =
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: string;
      errors?: ValidationErrors;
    };

export function useSubscription() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = async (
    payload: SubscriptionPayload
  ): Promise<TransactionResult | null> => {
    if (isSubmitting) {
      return null;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      let idempotencyKey = crypto.randomUUID();

      const subResponse = await api.post(
        "subscriptions",
        {
          plan_id: payload.plan_id,
          coupon: payload.coupon,
          email: payload.email,
        },
        {
          headers: { "Idempotency-Key": idempotencyKey },
        }
      );

      const subscription = subResponse.data;
      const subscription_id = subscription.id;

      idempotencyKey = crypto.randomUUID();
      const paymentPayload = {
        subscription_id: subscription_id,
        card_number: payload.card_number,
        client_name: payload.client_name,
        expire_date: payload.expire_date,
        cvc: payload.cvc,
        card_flag_id: payload.card_flag_id,
      };


      await api.post("payments", paymentPayload, {
        headers: { "Idempotency-Key": idempotencyKey },
      });

      const fullSubscriptionResponse = await api.get(
        `subscriptions/${subscription_id}`
      );

      setIsSubmitting(false);

      return { success: true, data: fullSubscriptionResponse.data };
    } catch (e: any) {
      setIsSubmitting(false);

      if (e?.response?.status === 422 && e?.response?.data?.errors) {
        return {
          success: false,
          error: e.response.data.message,
          errors: e.response.data.errors,
        };
      }

      let message = "Erro ao processar assinatura";
      if (e?.response?.data?.message) {
        message = e.response.data.message;
      }

      setError(message);
      return { success: false, error: message };
    }
  };

  return { createSubscription, isSubmitting, error, setError };
}
