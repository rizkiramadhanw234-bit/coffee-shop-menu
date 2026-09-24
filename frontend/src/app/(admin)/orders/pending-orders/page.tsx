"use client";

import { useOrderStore } from "@/stores/order.store";
import { useFindAllOrders } from "@/hooks/order.hook";
import PaginationPage from "@/components/pagination";
import { useState, useRef } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpinnerCustom } from "@/components/loading";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FaDatabase } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import OrderDetail from "@/components/order.detail";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

export default function PendingOrders() {
  const debouncedSearch = useRef<ReturnType<typeof setTimeout>>(null);
  const {
    customerName,
    setCustomerName,
    page,
    setPage,
    setStatusOrder,
    statusOrder,
  } = useOrderStore();
  const [search, setSearch] = useState(customerName ?? "");
  const limit = 10;
  const offset = (page - 1) * limit;

  const { data: orders, isPending } = useFindAllOrders(
    limit,
    offset,
    customerName,
    statusOrder,
  );
  const pendingOrder =
    orders?.data.filter((data) => data.statusOrder === "pending") ?? [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }

    debouncedSearch.current = setTimeout(() => {
      setCustomerName(e.target.value);
    }, 500);
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-bold pb-4">Pending Orders</h1>
      <div>
        <div className="pb-4">
          <Input
            className="w-50"
            placeholder="Cari nama customer..."
            onChange={handleSearch}
            value={search}
          />
          <CiSearch className="absolute left-110 top-16 text-gray-700" />
        </div>
        {/* table */}
        {isPending ? (
          <div className="flex items-center justify-center">
            <SpinnerCustom />
          </div>
        ) : (
          <>
            {pendingOrder.length === 0 ? (
              <div>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FaDatabase />
                    </EmptyMedia>
                    <EmptyTitle>No data</EmptyTitle>
                    <EmptyDescription>No data found</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              <>
                <Table>
                  <TableCaption className="pb-4">
                    A list of your Orders.
                  </TableCaption>
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="w-12">No.</TableHead>
                      <TableHead className="w-45">Order Code</TableHead>
                      <TableHead>Tgl & Waktu</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Status Order</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrder.map((order, i) => (
                      <TableRow key={order.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">
                          {order.orderCode}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {order.cart.cartItem.slice(0, 1).map((data) => (
                            <div
                              key={data.id}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={data.variant.product.imageUrl}
                                alt=""
                                className="w-15 h-15 rounded-2xl object-cover"
                              />
                              <div>
                                <p>{data.variant.product.productName}</p>
                                <p>{data.variant.variantName}</p>
                                <span>{data.qty}x</span>
                              </div>

                              {order.cart.cartItem.length > 1 && (
                                <p className="text-xs ml-2 text-gray-600">
                                  +{order.cart.cartItem.length - 1} more
                                </p>
                              )}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>{order.totalPrice}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.statusOrder.includes("pending")
                                ? "bg-amber-500"
                                : order.statusOrder.includes("confirmed")
                                  ? "bg-green-500"
                                  : order.statusOrder.includes("process")
                                    ? "bg-amber-700"
                                    : order.statusOrder.includes("failed")
                                      ? "bg-red-500"
                                      : order.statusOrder.includes("cancelled")
                                        ? "bg-red-500"
                                        : "bg-black"
                            }
                          >
                            {order.statusOrder}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <OrderDetail orderId={order.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
