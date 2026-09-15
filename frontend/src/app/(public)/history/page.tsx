"use client";

import { FaArrowLeft, FaHistory } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFindGuestOrders } from "@/hooks/order.hook";
import { Card } from "@/components/ui/card";
import { SpinnerCustom } from "@/components/loading";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
  pending: "bg-amber-100 text-amber-600",
};

export default function HistoryPage() {
  const router = useRouter();
  const { data: orders, isPending } = useFindGuestOrders();

  const historyOrders =
    orders?.filter((data) => data.statusOrder !== "pending") ?? [];

  return (
    <div className="min-h-screen">
      <div
        className="absolute top-0 rounded-full p-2 bg-black m-3"
        onClick={() => router.push("/menu")}
      >
        <FaArrowLeft className="text-white text-sm" />
      </div>

      <h1 className="font-bold text-center mt-4">History</h1>

      {isPending ? (
        <div className="flex items-center justify-center h-185">
          <SpinnerCustom />
        </div>
      ) : (
        <div className="pt-5 px-2">
          {historyOrders.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FaHistory />
                </EmptyMedia>
                <EmptyTitle>No History</EmptyTitle>
                <EmptyDescription>
                  Your completed or cancelled orders will show up here
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => router.push("/menu")}>Menu</Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="flex flex-col gap-4">
              {historyOrders.map((data) => (
                <Card key={data.id} className="px-4 gap-3">
                  {/* header */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="font-bold">{data.customerName}</p>
                      <p className="text-[11px] text-gray-500">
                        {data.orderCode} •{" "}
                        {new Date(data.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-2xl text-xs font-medium ${
                        statusColor[data.statusOrder] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {data.statusOrder}
                    </div>
                  </div>

                  {/* items preview */}
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {data.cart.cartItem.map((item) => (
                      <img
                        key={item.id}
                        src={item.variant.product.imageUrl}
                        alt={item.variant.variantName}
                        className="w-14 h-14 object-cover rounded-lg shrink-0"
                      />
                    ))}
                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-between border-t pt-2">
                    <p className="text-gray-500 text-sm">
                      {data.totalItem} items
                    </p>
                    <p className="font-bold">Rp.{data.totalPrice}K</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
