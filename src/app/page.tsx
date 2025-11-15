"use client";

import PlansPage from "@/components/checkout/PlansPage";
import ConfirmationPage from "@/components/checkout/ConfirmationPage";
import { useCheckout } from "@/context/CheckoutContext";
import CheckoutPage from "@/components/checkout/CheckoutPage";

function CheckoutFlowManager() {
  const { currentPage } = useCheckout();

  if (currentPage === "checkout") return <CheckoutPage />;
  if (currentPage === "confirmation") return <ConfirmationPage />;
  return <PlansPage />;
}

export default function HomePage() {
  return <CheckoutFlowManager />;
}
