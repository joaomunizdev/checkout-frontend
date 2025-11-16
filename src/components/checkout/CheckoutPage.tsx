"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  email: z.email("Email inválido"),
  client_name: z
    .string()
    .min(1, "Nome obrigatório")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Somente letras são permitidas"),
  card_number: z
    .string()
    .regex(/^\d+$/, "Somente números")
    .min(12, "O cartão deve ter entre 12 e 19 dígitos")
    .max(19, "O cartão deve ter entre 12 e 19 dígitos"),
  expire_date: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato deve ser MM/AA"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC deve ter 3 ou 4 números"),
  card_flag_id: z.string().min(1, "Selecione uma bandeira"),
  coupon: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { selectedPlan, setCurrentPage, setTransaction } = useCheckout();

  const cardFlags = useCardFlags();
  const {
    couponCode,
    setCouponCode,
    couponValid,
    couponError,
    loading: validatingCoupon,
    validateCoupon,
    calculateDiscount,
  } = useCoupon(selectedPlan);

  const {
    createSubscription,
    isSubmitting,
    error: globalError,
    setError: setGlobalError,
  } = useSubscription();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError: setFieldError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      client_name: "",
      card_number: "",
      expire_date: "",
      cvc: "",
      card_flag_id: "",
      coupon: "",
    },
  });

  const cardFlagId = useWatch({ control, name: "card_flag_id" });

  useEffect(() => {
    setValue("coupon", couponCode || "");
  }, [couponCode, setValue]);

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

  const onSubmit = async (formData: FormData) => {
    const payload = {
      ...formData,
      plan_id: selectedPlan.id,
      coupon: couponValid ? couponCode : null,
      card_flag_id: Number(formData.card_flag_id),
    };

    setGlobalError(null);

    const result = await createSubscription(payload);

    if (result && result.success) {
      setTransaction({ success: true, data: result.data });
      setCurrentPage("confirmation");
    } else if (result && !result.success) {
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          setFieldError(field as keyof FormData, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      } else {
        setGlobalError(result.error);
      }
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" {...register("email")} />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="coupon">Cupom de Desconto</Label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Digite o cupom"
                />
                <Button
                  type="button"
                  onClick={() => validateCoupon(couponCode)}
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

              {couponValid === false && couponError && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> {couponError}
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
                  {...register("client_name")}
                  onChange={(e) =>
                    setValue(
                      "client_name",
                      e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""),
                      { shouldValidate: true }
                    )
                  }
                  style={{ textTransform: "none" }}
                />
                {errors.client_name && (
                  <p className="text-destructive text-sm">
                    {errors.client_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="card_number">Número do Cartão</Label>
                <Input
                  id="card_number"
                  maxLength={19}
                  {...register("card_number")}
                  onChange={(e) =>
                    setValue("card_number", e.target.value.replace(/\D/g, ""), {
                      shouldValidate: true,
                    })
                  }
                />
                {errors.card_number && (
                  <p className="text-destructive text-sm">
                    {errors.card_number.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expire_date">Validade (MM/AA)</Label>
                  <Input
                    id="expire_date"
                    maxLength={5}
                    {...register("expire_date")}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length >= 2)
                        v = v.slice(0, 2) + "/" + v.slice(2, 4);
                      setValue("expire_date", v, { shouldValidate: true });
                    }}
                  />
                  {errors.expire_date && (
                    <p className="text-destructive text-sm">
                      {errors.expire_date.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    maxLength={4}
                    {...register("cvc")}
                    onChange={(e) =>
                      setValue("cvc", e.target.value.replace(/\D/g, ""), {
                        shouldValidate: true,
                      })
                    }
                  />
                  {errors.cvc && (
                    <p className="text-destructive text-sm">
                      {errors.cvc.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Bandeira</Label>
                <Select
                  onValueChange={(v) =>
                    setValue("card_flag_id", v, { shouldValidate: true })
                  }
                  value={cardFlagId || ""}
                >
                  <SelectTrigger aria-invalid={!!errors.card_flag_id}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cardFlags.map((flag) => (
                      <SelectItem key={flag.id} value={String(flag.id)}>
                        {flag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.card_flag_id && (
                  <p className="text-destructive text-sm">
                    {errors.card_flag_id.message}
                  </p>
                )}
              </div>
            </div>

            {globalError && (
              <Alert
                variant="destructive"
                onClick={() => setGlobalError(null)}
                className="cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <AlertDescription>{globalError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Finalizar Pagamento ({formatCurrency(total)})
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
                <p className="font-semibold">{selectedPlan.description}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan.periodicity} dias
                </p>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" /> Desconto
                    </span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
