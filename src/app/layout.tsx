import "./globals.css";
import { Metadata } from "next";
import { CheckoutProvider } from "@/context/CheckoutContext";

export const metadata: Metadata = { title: "Checkout App" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <CheckoutProvider>{children}</CheckoutProvider>
      </body>
    </html>
  );
}
