"use client";

import { Card } from "@/components/ui/card";
import RecentOrders from "@/components/recent.orders";
import { useFindAllOrders } from "@/hooks/order.hook";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/stores/order.store";

export default function Dashboard() {
  const router = useRouter();
  const { customerName, setCustomerName, statusOrder, setStatusOrder } =
    useOrderStore();

  const { data: orders } = useFindAllOrders(10, 0, customerName, statusOrder);
  const total = orders?.meta.total;
  const pendingOrders = orders?.data.filter(
    (order) => order.statusOrder === "pending",
  );
  const processOrder = orders?.data.filter(
    (process) => process.statusOrder === "process",
  );
  const confirmedOrders = orders?.data.filter(
    (confirmed) => confirmed.statusOrder === "confirmed",
  );

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <p>Selamat datang admin, berikut ringkasan pesanan hari ini:</p>
      </div>
      <div className="flex items-center justify-between py-4 gap-4">
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p>Total Pendapatan</p>
            <span>10000</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p>Total Pesanan</p>
            <span>{total}</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p> Pesanan Pending</p>
            <span>{pendingOrders?.length}</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p> Pesanan Diproses</p>
            <span>{processOrder?.length}</span>
          </div>
        </Card>
        <Card className="px-2 w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p> Pesanan Selesai</p>
            <span>{confirmedOrders?.length}</span>
          </div>
        </Card>
      </div>

      {/* table recent order */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
