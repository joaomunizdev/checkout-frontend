import { useState } from "react";
import type { Plan } from "./usePlans";
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

  const validateCoupon = async () => {
    if (!selectedPlan) return;
    if (!couponCode.trim()) {
      setCouponValid(null);
      setCouponData(null);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("coupons-validate", {
        coupon: couponCode,
        plan_id: selectedPlan.id,
      });
      if (res.data.valid) {
        setCouponValid(true);
        const coupons = await api.get(`coupons`);
        const found =
          (coupons || []).find((c: any) => c.name === couponCode) || null;
        setCouponData(found);
      }
    } catch {
      setCouponValid(false);
      setCouponData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (planPrice: number) => {
    if (!couponValid || !couponData) return 0;
    if (couponData.discount_percent)
      return planPrice * (couponData.discount_percent / 100);
    if (couponData.discount_amount)
      return Math.min(couponData.discount_amount, planPrice);
    return 0;
  };

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
