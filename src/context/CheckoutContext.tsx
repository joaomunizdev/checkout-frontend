"use client";
import { Plan } from "@/hooks/usePlans";
import { createContext, useContext, useState, ReactNode } from "react";

type Transaction = {
  success: boolean;
  data?: any;
  error?: string;
} | null;

type CheckoutContextType = {
  currentPage: "plans" | "checkout" | "confirmation";
  setCurrentPage: (p: CheckoutContextType["currentPage"]) => void;
  selectedPlan: Plan | null;
  setSelectedPlan: (p: Plan | null) => void;
  transaction: Transaction;
  setTransaction: (t: Transaction) => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] =
    useState<CheckoutContextType["currentPage"]>("plans");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [transaction, setTransaction] = useState<Transaction>(null);

  return (
    <CheckoutContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPlan,
        setSelectedPlan,
        transaction,
        setTransaction,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
