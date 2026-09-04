"use client";

import {
  useFindAllCarts,
  useAddToCart,
  useDecrementCart,
  useDeleteCart,
} from "@/hooks/cart.hook";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoTrash } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { SpinnerCustom } from "@/components/loading";
import OrderModal from "@/components/modals/order.modal";

export default function CartPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: carts, isLoading } = useFindAllCarts();
  const cartItem = carts?.data?.cartItem ?? [];

  const { mutateAsync: addToCart } = useAddToCart();
  const { mutateAsync: decrementCart } = useDecrementCart();
  const { mutateAsync: deleteCart, isPending } = useDeleteCart();

  const handleIncrement = async (variantId: string) => {
    await addToCart({ variantId: variantId, qty: 1 });
  };

  const handleDecrement = async (cartId: string, variantId: string) => {
    await decrementCart({
      cartId: cartId,
      variantId: variantId,
    });
  };

  const handleDeleteCart = async (id: string) => {
    await deleteCart(id);
    setIsOpen(false);
  };

  return (
    <>
      <div>
        <div
          className="absolute top-1 rounded-full p-2 bg-black m-3"
          onClick={() => router.push("/menu")}
        >
          <FaArrowLeft className="text-white text-sm" />
        </div>

        <h1 className="font-bold text-center mt-4">My Cart</h1>

        {isLoading ? (
          <div className="flex h-180 items-center justify-center">
            <SpinnerCustom />
          </div>
        ) : (
          <div className="pt-5 px-2 flex flex-col gap-2">
            {cartItem.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FaShoppingCart />
                  </EmptyMedia>
                  <EmptyTitle>No Carts</EmptyTitle>
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
                {cartItem.map((data) => (
                  <Card key={data.id} className="px-4">
                    <div className="flex gap-4 items-center justify-between">
                      <img
                        src={data.variant.product.imageUrl}
                        alt=""
                        className="w-20 h-20 rounded-md object-cover"
                        onClick={() =>
                          router.push(`/menu/${data.variant.product.id}`)
                        }
                      />
                      <div className="flex flex-col gap-1">
                        <div className="font-bold">
                          {data.variant.product.productName}
                        </div>
                        <div className="text-gray-600">
                          {data.variant.variantName}
                        </div>
                        <div>Rp.{data.variant.price}K</div>
                        <div>Subtotal: Rp.{data.subTotal}K</div>
                      </div>

                      <div className="flex gap-3 items-center justify-center">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleDecrement(data.id, data.variantId)
                          }
                        >
                          -
                        </Button>
                        <div>{data.qty}</div>
                        <Button
                          variant="secondary"
                          onClick={() => handleIncrement(data.variantId)}
                        >
                          +
                        </Button>
                      </div>

                      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger
                          render={<Button variant="destructive" />}
                        >
                          <IoTrash className="text-red-500 " />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your cart from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCart(data.id)}
                            >
                              {isPending ? "Loading..." : "Continue"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}

                {/* order section */}
                <div className="py-0 ">
                  <div>
                    <Card className="px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <h2 className="font-bold">Order Summary</h2>
                          <p>Total Item:</p>
                          <p className="font-bold">Total Harga:</p>
                        </div>

                        <div className="flex flex-col gap-1 text-right">
                          <p>{carts?.totalItem}</p>
                          <p className="font-bold">Rp.{carts?.totalPrice}K</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* order button */}
                <div className=" w-full">
                  <OrderModal cartId={carts?.data?.id ?? ""} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
