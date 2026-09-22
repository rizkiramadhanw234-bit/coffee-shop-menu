"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface OrderDetailProps {
  orderId: string;
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger render={<Button variant="default">Detail</Button>} />
        <DialogContent className="min-w-3xl">
          <div>sdsdsds</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
