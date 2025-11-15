import api from "@/services/api";
import { useEffect, useState } from "react";

export type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
  periodicity: number;
  active?: boolean;
};

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("plans")
      .then((res) => {
        if (mounted) setPlans(res.data || []);
      })
      .catch(() => {
        if (mounted) setPlans([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { plans, loading };
};
