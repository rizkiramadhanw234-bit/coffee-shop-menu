"use client";

import { useCreatePayment } from "@/hooks/payment.hook";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface PaymentProps {
  orderId: string;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function PaymentModal({ orderId }: PaymentProps) {
  const { mutateAsync: createPayment } = useCreatePayment();

  const handleSubmitPayment = async () => {
    const res = await createPayment(orderId);

    window.snap.pay(res.snapToken, {
      onSuccess: (result: any) => {
        console.log("success", result);
      },
      onPending: (result: any) => {
        console.log("pending", result);
      },
      onError: (result: any) => {
        console.log("error", result);
      },
      onClose: () => {
        console.log("popup closed without finishing payment");
      },
    });
  };

  useEffect(() => {
    const snapScript = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_SCRIPT;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScript as string;
    script.setAttribute("data-client-key", clientKey as string);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div>
        <Button onClick={handleSubmitPayment}>Pay</Button>
      </div>
    </>
  );
}
