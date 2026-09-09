"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useCreateOrder } from "@/hooks/order.hook";
import type { OrderRequest } from "@/types/order.type";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderProps {
  cartId: string;
}

export default function OrderModal({ cartId }: OrderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState<OrderRequest>({
    cartId: cartId,
    customerName: "",
    tableNo: 0,
  });

  const { mutateAsync: createOrder, isPending } = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createOrder(form as OrderRequest);
      router.push("/order");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button variant="default" className="w-full">
              Order
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Order</DialogTitle>
              <DialogDescription className="pb-2">
                Silahkan isi data order anda.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Nama Customer</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerName: e.target.value,
                    })
                  }
                />
              </Field>
              <Field>
                <Label htmlFor="tableNo">No. Meja</Label>
                <Input
                  id="tableNo"
                  name="tableNo"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tableNo: Number(e.target.value),
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">
                {isPending ? "Loading..." : "Continue Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
