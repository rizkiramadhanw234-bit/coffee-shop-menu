"use client";

import { useFindAllOrders } from "@/hooks/order.hook";
import { useState, useRef } from "react";
import { useOrderStore } from "@/stores/order.store";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import PaginationPage from "@/components/pagination";
import { CiSearch } from "react-icons/ci";
import OrderDetail from "@/components/order.detail";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FaDatabase } from "react-icons/fa6";
import { SpinnerCustom } from "@/components/loading";

const statusTabs = [
  { label: "Pending", value: "pending" },
  { label: "Proses", value: "process" },
  { label: "Selesai", value: "confirmed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AllOrders() {
  const debouncedSearch = useRef<ReturnType<typeof setTimeout>>(null);
  const {
    page,
    setPage,
    customerName,
    setCustomerName,
    statusOrder,
    setStatusOrder,
  } = useOrderStore();
  const [search, setSearch] = useState(customerName ?? "");

  const limit = 10;
  const offset = (page - 1) * limit;

  const { data: orders, isLoading } = useFindAllOrders(
    limit,
    offset,
    customerName,
    statusOrder,
  );
  const pendingOrders = orders?.data.filter(
    (pending) => pending.statusOrder === "pending",
  );
  const processOrder = orders?.data.filter(
    (process) => process.statusOrder === "process",
  );
  const confirmedOrders = orders?.data.filter(
    (confirmed) => confirmed.statusOrder === "confirmed",
  );
  const cancelOrders = orders?.data.filter(
    (cancel) => cancel.statusOrder === "cancelled",
  );
  const dataOrders = orders?.data ?? [];
  const totalOrders = orders?.meta.total ?? 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }

    debouncedSearch.current = setTimeout(() => {
      setCustomerName(e.target.value);
      setPage(1);
    }, 500);
  };

  const handelSelectStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusOrder(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div>
          <h1 className="font-bold text-2xl">Semua Pesanan</h1>
          <p>Selamat datang admin, berikut ringkasan pesanan hari ini:</p>
        </div>
        <div className="flex items-center justify-between gap-4 py-4">
          <Card className="px-2 w-full">
            <span className="absolute ml-4">Icon</span>
            <div className="flex flex-col items-center gap-2">
              <p>Total Pesanan</p>
              <span>{totalOrders}</span>
            </div>
          </Card>
          <Card className="px-2 w-full">
            <div className="flex flex-col items-center gap-2">
              <p>Pesanan Pending</p>
              <span>{pendingOrders?.length}</span>
            </div>
          </Card>
          <Card className="px-2 w-full">
            <div className="flex flex-col items-center gap-2">
              <p>Pesanan Diproses</p>
              <span>{processOrder?.length}</span>
            </div>
          </Card>
          <Card className="px-2 w-full">
            <div className="flex flex-col items-center gap-2">
              <p>Pesanan Selesai</p>
              <span>{confirmedOrders?.length}</span>
            </div>
          </Card>
          <Card className="px-2 w-full">
            <div className="flex flex-col items-center gap-2">
              <p>Pesanan Dibatalkan</p>
              <span>{cancelOrders?.length}</span>
            </div>
          </Card>
        </div>

        {/* table all orders */}
        <div>
          <div className="flex items-center justify-end gap-4 py-4">
            <Input
              className="w-50"
              placeholder="Cari nama pesanan..."
              onChange={handleSearch}
              value={search}
            />
            <CiSearch className="absolute right-38 text-gray-700" />

            <NativeSelect onChange={handelSelectStatus}>
              <NativeSelectOption value="">Pilih Status</NativeSelectOption>
              {statusTabs.map((status, i) => (
                <NativeSelectOption value={status.value} key={i}>
                  {status.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* table */}
          {isLoading ? (
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
                      {dataOrders.map((order) => (
                        <TableRow key={order.id}>
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
                          <TableCell>{order.statusOrder}</TableCell>
                          <TableCell className="text-right">
                            <OrderDetail orderId={order.id} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* pagination */}
                  <div className="pb-4">
                    <PaginationPage
                      page={page}
                      setPage={setPage}
                      totalPages={totalPages}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
