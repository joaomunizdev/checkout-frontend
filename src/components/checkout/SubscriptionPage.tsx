"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/context/CheckoutContext";
import { History, CheckCircle, XCircle } from "lucide-react";

import {
  useSubscriptionsList,
  SubscriptionResponse,
} from "@/hooks/useSubscriptions";

export default function SubscriptionPage() {
  const { setCurrentPage } = useCheckout();
  const { subscriptions } = useSubscriptionsList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubscriptionResponse | null>(
    null
  );

  const handleOpenHistory = (subscription: SubscriptionResponse) => {
    setSelectedSub(subscription);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="secondary"
        onClick={() => setCurrentPage("plans")}
        className="mb-6"
      >
        Voltar aos planos
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Assinaturas</CardTitle>
            <CardDescription>
              Veja o histórico das suas assinaturas e status de pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length > 0 ? (
                  subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.plan.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sub.active ? "default" : "outline"}>
                          {sub.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(sub.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenHistory(sub)}
                        >
                          <History className="w-4 h-4 mr-2" />
                          Histórico
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Nenhuma assinatura encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico de Transações</DialogTitle>
            <DialogDescription>
              Plano: {selectedSub?.plan.description}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Data</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead>Cartão</TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Valor Pago
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSub?.transaction &&
                selectedSub.transaction.length > 0 ? (
                  selectedSub.transaction.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={tx.status ? "default" : "destructive"}>
                          {tx.status ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {tx.status ? "Aprovada" : "Recusada"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{tx.card.client_name}</div>
                        <div className="text-sm text-muted-foreground">
                          (Final {String(tx.card.last_4_digits)})
                        </div>
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        R$ {tx.price_paid.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Nenhuma transação encontrada para esta assinatura.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
