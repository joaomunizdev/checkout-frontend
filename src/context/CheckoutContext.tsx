"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/services/api";
import axios from "axios";

export interface Plan {
  id: string;
  name: string;
  price: number;
}

export interface TransactionResult {
  id: string;
  status: "success" | "pending" | "failed";
  amount: number;
}

type Transaction = TransactionResult | null;

type CheckoutContextType = {
  currentPage: "plans" | "checkout" | "confirmation" | "subscriptions";
  setCurrentPage: (p: CheckoutContextType["currentPage"]) => void;
  selectedPlan: Plan | null;
  setSelectedPlan: (p: Plan | null) => void;
  transaction: Transaction;
  setTransaction: (t: Transaction) => void;
  isApiAvailable: boolean | null;
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

  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await api.get("/health");
        setIsApiAvailable(true);
      } catch (error) {
        if (axios.isAxiosError(error) && !error.response) {
          console.error("API connection failed:", error.message);
          setIsApiAvailable(false);
        } else {
          setIsApiAvailable(true);
        }
      }
    };

    checkApiStatus();
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPlan,
        setSelectedPlan,
        transaction,
        setTransaction,
        isApiAvailable,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
