"use client";

import { useFindGuestOrders } from "@/hooks/order.hook";

export default function OrderPage() {
  const { data: orders } = useFindGuestOrders();
  console.log(orders);
  return (
    <>
      <h1>hello</h1>
    </>
  );
}
