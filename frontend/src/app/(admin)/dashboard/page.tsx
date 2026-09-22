"use client";

import { Card } from "@/components/ui/card";
import RecentOrders from "@/components/recent.orders";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <p>Selamat datang admin, berikut ringkasan pesanan hari ini:</p>
      </div>
      <div className="flex items-center justify-between py-4">
        <Card>Total Pendapatan</Card>
        <Card>Total Pesanan</Card>
        <Card>Pesanan Pending</Card>
        <Card>Pesanan Diproses</Card>
        <Card>Pesanan Selesai</Card>
      </div>

      {/* table recent order */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
