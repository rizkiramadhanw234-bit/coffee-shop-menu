"use client";

import { useFindGuestOrders } from "@/hooks/order.hook";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { GoClockFill } from "react-icons/go";
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
import PaymentModal from "@/components/modals/payment.modal";

export default function OrderPage() {
  const router = useRouter();
  const { data: orders, isPending } = useFindGuestOrders();

  const pendingOrders =
    orders?.filter((data) => data.paymentStatus === "pending") ?? [];

  return (
    <div className="min-h-screen">
      <div
        className="absolute top-0 rounded-full p-2 bg-black m-3"
        onClick={() => router.push("/menu")}
      >
        <FaArrowLeft className="text-white text-sm" />
      </div>

      <h1 className="font-bold text-center mt-4">My Order</h1>

      {isPending ? (
        <div className="flex items-center justify-center h-185">
          <SpinnerCustom />
        </div>
      ) : (
        <>
          {/* content */}
          <div className="pt-5 px-2">
            {/* empty state */}
            {pendingOrders?.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FaShoppingCart />
                  </EmptyMedia>
                  <EmptyTitle>No Orders</EmptyTitle>
                  <EmptyDescription>
                    Explore menu to find some product
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => router.push("/menu")}>Menu</Button>
                </EmptyContent>
              </Empty>
            ) : (
              <>
                <Card className="px-4 bg-amber-50/50 ">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <GoClockFill className="text-3xl text-amber-500" />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold">Order Placed</p>
                      <p className="text-[11px] pt-1">
                        Thank You! Your order has been received. <br />
                        Please scan the QRIS below to complete payment.
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-amber-100 rounded-2xl">
                      <p className="text-xs text-amber-600">pending</p>
                    </div>
                  </div>
                </Card>

                {/* customer information */}
                <div className="pt-4">
                  <div className="flex flex-col gap-4">
                    {pendingOrders?.map((data) => (
                      <Card
                        key={data.id}
                        className="grid grid-cols-3 items-start justify-center gap-4 px-4"
                      >
                        <div>
                          <p>Customer Name</p>
                          <p>{data.customerName}</p>
                        </div>
                        <div>
                          <p>Table No.</p>
                          <p>{data.tableNo}</p>
                        </div>
                        <div>
                          <p>Order Time</p>
                          <p>
                            {new Date(data.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p>Order Code</p>
                          <p>{data.orderCode}</p>
                        </div>
                        <div>
                          <p>Total Items</p>
                          <p>{data.totalItem}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* items order */}
                <div className="pt-4">
                  <p className="font-bold px-2">Order Items</p>
                  <div className="pt-2">
                    {pendingOrders?.map((data) => (
                      <Card key={data.id} className="px-4 flex flex-col gap-6">
                        {data.cart.cartItem.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={item.variant.product.imageUrl}
                              alt=""
                              className="w-17 h-17 rounded-lg object-cover"
                            />
                            <div className="flex w-full items-center justify-between">
                              {/* left */}
                              <div className="flex flex-col gap-1">
                                <p className="font-bold">
                                  {item.variant.product.productName}
                                </p>
                                <p className="text-gray-500">
                                  {item.variant.variantName}
                                </p>
                                <p>Rp.{item.variant.price}K</p>
                              </div>

                              {/* right */}
                              <div className="flex flex-col items-end justify-end gap-1">
                                <p className="font-bold">X{item.qty}</p>
                                <p className="text-gray-500">
                                  Rp.{item.subTotal}K
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* total */}
                <div className="pt-4">
                  {pendingOrders?.map((data) => (
                    <Card key={data.id} className="px-4 flex flex-col gap-1">
                      <div className="flex w-full items-center justify-between">
                        {/* left */}
                        <div className="flex flex-col gap-1">
                          <div>Total Item:</div>
                          <div>Total Price:</div>
                        </div>

                        {/* right */}
                        <div className="flex flex-col items-end gap-1">
                          <div>{data.totalItem}</div>
                          <div className="font-bold">Rp.{data.totalPrice}K</div>
                        </div>
                      </div>

                      {/* payment */}
                      <div className="pt-4">
                        <PaymentModal orderId={data.id} />
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
