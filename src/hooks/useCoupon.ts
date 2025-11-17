import { useCallback, useEffect, useState } from "react";
import { Plan } from "./usePlans";
import api from "@/services/api";
import { AxiosError } from "axios";
export type Coupon = {
  id: number;
  name: string;
  discount_percent?: number;
  discount_amount?: number;
};

const translateCouponError = (message: string): string => {
  switch (message) {
    case "Invalid Coupon":
      return "Cupom inválido";
    case "Expired coupon!":
      return "Cupom expirado!";
    case "Coupon usage limit exceeded!":
      return "Limite de uso do cupom excedido!";
    default:
      return "Cupom inválido ou não aplicável a este plano.";
  }
};

export const useCoupon = (selectedPlan: Plan | null) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponData, setCouponData] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlanId = selectedPlan?.id;

  useEffect(() => {
    setCouponCode("");
    setCouponValid(null);
    setCouponData(null);
    setCouponError(null);
  }, [selectedPlanId]);

  const validateCoupon = useCallback(
    async (code: string) => {
      if (!selectedPlanId) return;

      const coupon = code.trim();
      setCouponCode(code);

      if (!coupon) {
        setCouponValid(null);
        setCouponData(null);
        setCouponError(null);
        return;
      }

      setLoading(true);
      setCouponValid(null);
      setCouponData(null);
      setCouponError(null);

      try {
        const res = await api.post("coupons-validate", {
          coupon,
          plan_id: selectedPlanId,
        });

        if (res.data.valid) {
          setCouponValid(true);
          setCouponError(null);

          const found = (await api.get(`coupons/${coupon}`)) || null;
          const couponData: Coupon = found.data;

          setCouponData(couponData);
        } else {
          setCouponValid(false);
          setCouponData(null);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.status === 422) {
            setCouponError(
              translateCouponError(
                error.response?.data.message || "Invalid Coupon"
              )
            );
          }
        }
        setCouponValid(false);
        setCouponData(null);
      } finally {
        setLoading(false);
      }
    },
    [selectedPlanId]
  );

  const calculateDiscount = useCallback(
    (planPrice: number) => {
      if (!couponValid || !couponData) return 0;

      if (couponData.discount_percent) {
        return planPrice * (couponData.discount_percent / 100);
      }

      if (couponData.discount_amount) {
        return Math.min(couponData.discount_amount, planPrice);
      }

      return 0;
    },
    [couponValid, couponData]
  );

  return {
    couponCode,
    setCouponCode,
    couponValid,
    couponError,
    couponData,
    loading,
    validateCoupon,
    calculateDiscount,
  };
};
