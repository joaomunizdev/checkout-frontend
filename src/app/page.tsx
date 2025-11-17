"use client";

import PlansPage from "@/components/checkout/PlansPage";
import ConfirmationPage from "@/components/checkout/ConfirmationPage";
import { useCheckout } from "@/context/CheckoutContext";
import CheckoutPage from "@/components/checkout/CheckoutPage";
import SubscriptionPage from "@/components/checkout/SubscriptionPage";

function ApiErrorComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="p-8 border rounded-lg shadow-lg bg-card max-w-md text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Erro de Conexão
        </h2>
        <p className="text-muted-foreground">
          Não foi possível conectar a API.
        </p>
      </div>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function CheckoutFlowManager() {
  const { currentPage, isApiAvailable } = useCheckout();

  if (isApiAvailable === null) {
    return <LoadingComponent />;
  }

  if (isApiAvailable === false) {
    return <ApiErrorComponent />;
  }

  if (currentPage === "checkout") return <CheckoutPage />;
  if (currentPage === "confirmation") return <ConfirmationPage />;
  if (currentPage === "subscriptions") return <SubscriptionPage />;
  return <PlansPage />;
}

export default function HomePage() {
  return <CheckoutFlowManager />;
}
