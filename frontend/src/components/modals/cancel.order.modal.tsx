"use client";

import { useCancelOrder } from "@/hooks/order.hook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface CancelProps {
  orderId: string;
}

export default function CancelOrderModal({ orderId }: CancelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: cancelOrder, isPending } = useCancelOrder(orderId);

  const handleSubmit = async () => {
    await cancelOrder();
    setIsOpen(false);
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          {isPending ? "Loading..." : "Cancel Order"}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
