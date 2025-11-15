"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";

const formatLast4 = (cardNumber: string | number | undefined) => {
  if (!cardNumber) return "****";
  return String(cardNumber).slice(-4);
};

export default function ConfirmationPage() {
  const { transaction, setSelectedPlan, setTransaction, setCurrentPage } =
    useCheckout();

  const resetToPlans = () => {
    setSelectedPlan(null);
    setTransaction(null);
    setCurrentPage("plans");
  };
  if (!transaction) {
    return (
      <div className="relative container mx-auto px-4 py-12 text-center pt-32">
        <p>Nenhuma transação encontrada</p>
        <Button onClick={resetToPlans} className="mt-4">
          Voltar aos Planos
        </Button>
      </div>
    );
  }

  const isPaymentSuccessful =
    transaction.success && transaction.data && transaction.data.status === true;
  const { email, plan, price_paid, transaction: txData } = transaction.data;
  const last4 = formatLast4(txData?.card?.card_number);

  if (isPaymentSuccessful) {
    return (
      <div className="relative container mx-auto px-4 py-12 pt-32">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
              <CardDescription>
                Sua assinatura foi criada com sucesso
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium">
                    {plan?.description || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Cartão</span>
                  <span className="font-medium">Final **** {last4}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Valor do Plano</span>
                  <span className="font-medium">
                    R$ {plan.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Valor Pago</span>
                  <span className="font-medium">
                    R$ {price_paid.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={resetToPlans} className="w-full">
                Fazer Nova Assinatura
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative container mx-auto px-4 py-12 pt-32">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Erro no Pagamento</CardTitle>
            <CardDescription>
              Não foi possível processar sua assinatura
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">E-mail</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-medium">
                  {plan?.description || "N/A"}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Cartão</span>
                <span className="font-medium">Final **** {last4}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Valor do Plano</span>
                <span className="font-medium">R$ {plan.price.toFixed(2)}</span>
              </div>
            </div>

            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>
                {!transaction.success && transaction.error
                  ? transaction.error
                  : "Ocorreu um erro ao processar o pagamento"}
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button onClick={resetToPlans} className="flex-1">
              Voltar aos Planos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
