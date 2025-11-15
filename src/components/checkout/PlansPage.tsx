"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Plan, usePlans } from "@/hooks/usePlans";
import { useCheckout } from "@/context/CheckoutContext";

export default function PlansPage() {
  const { plans, loading } = usePlans();
  const { setSelectedPlan, setCurrentPage } = useCheckout();

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentPage("checkout");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Escolha seu Plano
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.description}</CardTitle>
              <CardDescription>
                {plan.periodicity} dias de acesso
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">
                  R$ {plan.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{plan.periodicity}d
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(plan)}
                disabled={!plan.active}
              >
                Assinar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
