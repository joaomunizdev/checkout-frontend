"use client";

import { useCheckout } from "@/context/CheckoutContext";
import { Plan } from "@/hooks/usePlans";

export function PlansPage() {
  const { setSelectedPlan, setCurrentPage } = useCheckout();

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentPage("checkout");
  };

  return (
    <div>
      <button
        onClick={() =>
          handleSubscribe({
            id: 1,
            name: "Teste",
            description: "Plano teste",
            price: 0,
            periodicity: 30,
          })
        }
      >
        Assinar
      </button>
    </div>
  );
}
