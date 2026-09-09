import { appDataSource } from "../../config/db.js";
import { Payment } from "./payment.entity.js";
import { Order } from "../order/order.entity.js";
import { snap, core, MidtransCore } from "./payment.config.js";
import { AppError, HTTP_STATUS } from "../../utils/error.js";

const paymentRepo = appDataSource.getRepository(Payment);
const orderRepo = appDataSource.getRepository(Order);

export async function createPayment(guestId: string, orderId: string) {
  const order = await orderRepo.findOne({
    where: { id: orderId },
  });
  if (!order) {
    throw new AppError("Order not found!", HTTP_STATUS.NOT_FOUND);
  }

  let parameter = {
    transaction_details: {
      order_id: order.orderCode,
      gross_amount: order.totalPrice,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: order.customerName,
    },
  };

  const snapToken = await snap.createTransaction(parameter);

  const payment = new Payment();
  payment.guestId = guestId;
  payment.orderId = order.id;
  payment.grossAmount = order.totalPrice;
  payment.snapToken = snapToken.token;
  payment.paymentStatus = "pending";
  const newPayment = await paymentRepo.save(payment);

  order.paymentStatus = "pending";
  await orderRepo.save(order);

  if (!newPayment) {
    throw new AppError("payment failed", HTTP_STATUS.BAD_REQUEST);
  }

  return {
    data: { snapToken: snapToken.token, redirectUrl: snapToken.redirect_url },
  };
}

export async function handleNotification(notificationPayload: any) {
  const statusResponse = await (core as MidtransCore).transaction.notification(
    notificationPayload,
  );

  const orderCode = statusResponse.order_id;
  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  const order = await orderRepo.findOne({ where: { orderCode } });
  if (!order) throw new AppError("Order not found!", HTTP_STATUS.NOT_FOUND);

  const payment = await paymentRepo.findOne({ where: { orderId: order.id } });
  if (!payment) throw new AppError("Payment not found!", HTTP_STATUS.NOT_FOUND);

  let status: string;
  if (transactionStatus === "capture") {
    status = fraudStatus === "accept" ? "paid" : "challenge";
  } else if (transactionStatus === "settlement") {
    status = "paid";
  } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
    status = "failed";
  } else if (transactionStatus === "pending") {
    status = "pending";
  } else {
    status = "unknown";
  }

  payment.paymentStatus = status;
  order.paymentStatus = status;
  await paymentRepo.save(payment);
  await orderRepo.save(order);

  return { data: payment };
}

export async function findPaymentByOrder(orderId: string) {
  const payment = await paymentRepo.findOne({ where: { orderId } });
  if (!payment) {
    throw new AppError("payment not found!", HTTP_STATUS.NOT_FOUND);
  }
  return { data: payment };
}
