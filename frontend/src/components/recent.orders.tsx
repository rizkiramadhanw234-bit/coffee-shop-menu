"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import OrderDetail from "./order.detail";
import { SpinnerCustom } from "./loading";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { FaDatabase } from "react-icons/fa6";
import { useOrderStore } from "@/stores/order.store";
import { useFindAllOrders } from "@/hooks/order.hook";
import { useState, useRef } from "react";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

const statusTabs = [
  { label: "Pending", value: "pending" },
  { label: "Proses", value: "process" },
  { label: "Selesai", value: "confirmed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function RecentOrders() {
  const debouncedSearch = useRef<ReturnType<typeof setTimeout>>(null);
  const { customerName, setCustomerName, statusOrder, setStatusOrder } =
    useOrderStore();
  const [search, setSearch] = useState(customerName ?? "");
  const { data: orders, isPending } = useFindAllOrders(
    10,
    0,
    customerName,
    statusOrder,
  );
  const dataOrders = orders?.data ?? [];
  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusOrder(e.target.value);
  };

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
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-bold py-4">Pesanan Terbaru</h2>
        <div className="flex items-center justify-center gap-4 py-4">
          <div>
            <Input
              className="w-50"
              placeholder="Cari nama customer..."
              onChange={handleSearch}
              value={search}
            />
            <CiSearch className="absolute right-38 top-52 text-gray-700" />
          </div>

          <div>
            <NativeSelect onChange={handleStatus}>
              <NativeSelectOption value="">Pilih Status</NativeSelectOption>
              {statusTabs.map((data, i) => (
                <NativeSelectOption key={i} value={data.value}>
                  {data.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>
      </div>
      {/* table */}
      {isPending ? (
        <div className="flex items-center justify-center">
          <SpinnerCustom />
        </div>
      ) : (
        <>
          {dataOrders.length === 0 ? (
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
                  {dataOrders.map((order, i) => (
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
    </>
  );
}
