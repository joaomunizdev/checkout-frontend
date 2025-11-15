"use client";

import { useCheckout } from "@/context/CheckoutContext";
import { Plan } from "@/hooks/usePlans";

export function PlansPage() {
  const { setSelectedPlan, setCurrentPage } = useCheckout();

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentPage("checkout");
    console.log("Mudando para checkout...");
  };

  return (
    <div>
      <button onClick={() => handleSubscribe({ id: 1, name: "Teste" })}>
        Assinar
      </button>
    </div>
  );
}
