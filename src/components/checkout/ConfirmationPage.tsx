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

export default function ConfirmationPage() {
  const { transaction, setSelectedPlan, setTransaction, setCurrentPage } =
    useCheckout();

  const resetToPlans = () => {
    setSelectedPlan(null);
    setTransaction(null);
    setCurrentPage("plans");
  };
  console.log(transaction)
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

  if (transaction.success) {
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

          <CardContent>
            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>
                {transaction.error ||
                  "Ocorreu um erro ao processar o pagamento"}
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              onClick={() => setCurrentPage("checkout")}
              variant="outline"
              className="flex-1"
            >
              Tentar Novamente
            </Button>
            <Button onClick={resetToPlans} className="flex-1">
              Voltar aos Planos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
