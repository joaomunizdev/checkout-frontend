"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, XCircle, CreditCard, Tag } from "lucide-react";

import { useCheckout } from "@/context/CheckoutContext";
import { useCardFlags } from "@/hooks/useCardFlags";
import { useCoupon } from "@/hooks/useCoupon";
import { useSubscription } from "@/hooks/useSubscriptions";

export default function CheckoutPage() {
  const { selectedPlan, setCurrentPage, setTransaction } = useCheckout();
  const cardFlags = useCardFlags();
  const {
    couponCode,
    setCouponCode,
    couponValid,
    loading: validatingCoupon,
    validateCoupon,
    calculateDiscount,
  } = useCoupon(selectedPlan);

  const { createSubscription, isSubmitting, error, setError } =
    useSubscription();

  const [formData, setFormData] = useState({
    email: "",
    card_number: "",
    client_name: "",
    expire_date: "",
    cvc: "",
    card_flag_id: "",
  });

  if (!selectedPlan) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Nenhum plano selecionado.</p>
        <Button onClick={() => setCurrentPage("plans")} className="mt-4">
          Voltar aos Planos
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      plan_id: selectedPlan.id,
      coupon: couponValid ? couponCode : null,
    };

    const data = await createSubscription(payload);

    if (data) {
      setTransaction({ success: true, data });
      setCurrentPage("confirmation");
    }
  };

  const subtotal = selectedPlan.price;
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="secondary"
        onClick={() => setCurrentPage("plans")}
        className="mb-6"
      >
        Voltar aos planos
      </Button>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="coupon">Cupom de Desconto</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Digite o cupom"
                />
                <Button
                  type="button"
                  onClick={validateCoupon}
                  disabled={validatingCoupon || !couponCode.trim()}
                >
                  {validatingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              </div>
              {couponValid === true && (
                <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Cupom válido!
                </p>
              )}
              {couponValid === false && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Cupom inválido
                </p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" /> Dados do Cartão
              </h3>

              <div>
                <Label htmlFor="client_name">Nome no Cartão</Label>
                <Input
                  id="client_name"
                  required
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      client_name: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="card_number">Número do Cartão</Label>
                <Input
                  id="card_number"
                  required
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={formData.card_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      card_number: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expire_date">Validade (MM/AA)</Label>
                  <Input
                    id="expire_date"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={formData.expire_date}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length >= 2)
                        val = val.slice(0, 2) + "/" + val.slice(2, 4);
                      setFormData({ ...formData, expire_date: val });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={formData.cvc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cvc: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="card_flag">Bandeira</Label>
                <Select
                  required
                  value={formData.card_flag_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, card_flag_id: value })
                  }
                >
                  <SelectTrigger id="card_flag">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cardFlags.map((flag) => (
                      <SelectItem key={flag.id} value={flag.id}>
                        {flag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                onClick={() => setError(null)}
                className="cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Finalizar Pagamento (R$ {total.toFixed(2)})
            </Button>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Plano Selecionado
                </p>
                <p className="font-semibold">{selectedPlan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.periodicity} dias
                </p>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" /> Desconto
                    </span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
