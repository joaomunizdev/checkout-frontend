import { useCallback, useEffect, useState } from "react";
import { Plan } from "./usePlans";
import api from "@/services/api";
export type Coupon = {
  id: number;
  name: string;
  discount_percent?: number;
  discount_amount?: number;
};
export const useCoupon = (selectedPlan: Plan | null) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponData, setCouponData] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlanId = selectedPlan?.id;

  useEffect(() => {
    setCouponCode("");
    setCouponValid(null);
    setCouponData(null);
  }, [selectedPlanId]);

  const validateCoupon = useCallback(
    async (code: string) => {
      if (!selectedPlanId) return;

      const coupon = code.trim();
      setCouponCode(code);

      if (!coupon) {
        setCouponValid(null);
        setCouponData(null);
        return;
      }

      setLoading(true);
      setCouponValid(null);
      setCouponData(null);

      try {
        const res = await api.post("coupons-validate", {
          coupon,
          plan_id: selectedPlanId,
        });

        if (res.data.valid) {
          setCouponValid(true);

          const coupons = await api.get("coupons");
          const found =
            coupons.data.find((c: Coupon) => c.name === coupon) || null;

          setCouponData(found);
        } else {
          setCouponValid(false);
          setCouponData(null);
        }
      } catch {
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
    couponData,
    loading,
    validateCoupon,
    calculateDiscount,
  };
};
