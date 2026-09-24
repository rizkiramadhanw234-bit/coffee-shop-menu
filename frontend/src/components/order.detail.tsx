"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  useFindOrderById,
  useUpdateStatusOrder,
  useUpdatePaymentSatus,
} from "@/hooks/order.hook";
import { Badge } from "@/components/ui/badge";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface OrderDetailProps {
  orderId: string;
}

const statusOrderTabs = [
  { label: "Pending", value: "pending" },
  { label: "Proses", value: "process" },
  { label: "Selesai", value: "confirmed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

const paymentStatusTabs = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

const formatDate = (date?: string | Date) =>
  date
    ? new Date(date).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { data: order } = useFindOrderById(orderId);
  const dataOrder = order ?? null;

  // update order status
  const { mutateAsync: updateStatusOrder } = useUpdateStatusOrder(orderId);
  const handleUpdateStatusOrder = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.preventDefault();
    await updateStatusOrder(e.target.value);
  };

  // update payment status
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentSatus(orderId);
  const handleUpdatePaymentStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.preventDefault();
    await updatePaymentStatus(e.target.value);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger render={<Button variant="default">Detail</Button>} />
        <DialogContent className="min-w-lg">
          <h1 className="font-bold pb-2">Detail Pesanan</h1>

          {/* header */}
          <div className="flex flex-col items-start gap-4 border-b pb-3">
            <div className="flex items-center gap-4">
              <p className="font-semibold">{dataOrder?.orderCode}</p>
              <p>
                Status Order:{" "}
                <Badge
                  className={
                    dataOrder?.statusOrder.includes("pending")
                      ? "bg-amber-500"
                      : dataOrder?.statusOrder.includes("confirmed")
                        ? "bg-green-500"
                        : dataOrder?.statusOrder.includes("process")
                          ? "bg-amber-700"
                          : dataOrder?.statusOrder.includes("failed") ||
                              dataOrder?.statusOrder.includes("cancelled")
                            ? "bg-red-500"
                            : "bg-black"
                  }
                >
                  {dataOrder?.statusOrder}
                </Badge>
              </p>
            </div>
            <div>
              <p>
                Customer:{" "}
                <span className="font-bold">{dataOrder?.customerName}</span>
              </p>
              <p>
                No. Meja:{" "}
                <span className="font-bold">{dataOrder?.tableNo}</span>
              </p>

              <div className="text-xs text-muted-foreground pt-2">
                <p>Dibuat pada {formatDate(dataOrder?.createdAt)}</p>
                <p>Terakhir diperbarui {formatDate(dataOrder?.updatedAt)}</p>
              </div>
            </div>

            {/* update status */}
            <div className="grid grid-cols-2 gap-4 ">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">
                  Status Pesanan
                </label>
                <NativeSelect
                  defaultValue={dataOrder?.statusOrder}
                  onChange={handleUpdateStatusOrder}
                >
                  {statusOrderTabs.map((data, i) => (
                    <NativeSelectOption key={i} value={data.value}>
                      {data.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">
                  Status Pembayaran
                </label>
                <NativeSelect
                  defaultValue={dataOrder?.paymentStatus}
                  onChange={handleUpdatePaymentStatus}
                >
                  {paymentStatusTabs.map((data, i) => (
                    <NativeSelectOption key={i} value={data.value}>
                      {data.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>
          </div>

          {/* items */}
          <div className="flex flex-col gap-2 py-2">
            {dataOrder?.cart.cartItem.map((data) => (
              <div key={data.id} className="flex items-center gap-3">
                <img
                  src={data.variant.product.imageUrl}
                  alt={data.variant.product.productName}
                  className="size-20 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-bold">
                    {data.variant.product.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.variant.variantName}
                  </p>
                  <p className="text-sm">
                    Rp.{data.variant.price}K x {data.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* footer info */}
          <div className="flex items-center justify-between border-t pt-3 text-sm">
            <p>
              Pembayaran:{" "}
              <Badge
                className={
                  dataOrder?.paymentStatus.includes("pending")
                    ? "bg-amber-500"
                    : dataOrder?.paymentStatus.includes("paid")
                      ? "bg-green-500"
                      : dataOrder?.paymentStatus.includes("failed")
                        ? "bg-amber-700"
                        : dataOrder?.paymentStatus.includes("refunded")
                          ? "bg-red-500"
                          : "bg-black"
                }
              >
                {dataOrder?.paymentStatus}
              </Badge>
            </p>
            <p>
              Total ({dataOrder?.totalItem} item):{" "}
              <span className="font-bold">Rp.{dataOrder?.totalPrice}K</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
