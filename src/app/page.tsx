"use client";

import PlansPage from "@/components/checkout/PlansPage";
import ConfirmationPage from "@/components/checkout/ConfirmationPage";
import { useCheckout } from "@/context/CheckoutContext";
import CheckoutPage from "@/components/checkout/CheckoutPage";
import SubscriptionPage from "@/components/checkout/SubscriptionPage";

function CheckoutFlowManager() {
  const { currentPage } = useCheckout();

  if (currentPage === "checkout") return <CheckoutPage />;
  if (currentPage === "confirmation") return <ConfirmationPage />;
  if (currentPage === "subscriptions") return <SubscriptionPage />;
  return <PlansPage />;
}

export default function HomePage() {
  return <CheckoutFlowManager />;
}
