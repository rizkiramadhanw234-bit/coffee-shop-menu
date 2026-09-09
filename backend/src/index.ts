import "reflect-metadata";
import express, { Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { initSocket } from "./socket/index.js";
import { dbConnection } from "./config/db.js";

// routes
import categoryRouter from "./modules/category/category.route.js";
import productRouter from "./modules/product/product.route.js";
import variantRouter from "./modules/product-variant/variant.route.js";
import cartRouter from "./modules/cart/cart.route.js";
import orderRouter from "./modules/order/order.route.js";
import adminRouter from "./modules/admin/admin.route.js";
import paymentRouter from "./modules/payment/payment.route.js";

dbConnection();

const app = express();
const server = createServer(app);
initSocket(server);

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.send("welcome");
});

// routes
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/variant", variantRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

server.listen(process.env.PORT, () => {
  console.log("server is running on port:", process.env.PORT);
});
