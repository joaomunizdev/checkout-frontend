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
  card_flag_id: string;
};

export const useSubscription = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = async (payload: SubscriptionPayload) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await api.post("subscriptions", payload, {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      });

      setIsSubmitting(false);
      return data;
    } catch (err: any) {
      let message = "Erro ao conectar com o servidor";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }

      setError(message);
      setIsSubmitting(false);
      return null;
    }
  };

  return { createSubscription, isSubmitting, error, setError };
};
