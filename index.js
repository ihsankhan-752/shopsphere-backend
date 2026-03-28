import "dotenv/config";
import express from "express";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import fileRouter from "./routes/file.route.js";
import bannerRouter from "./routes/banner.route.js";
import addressRouter from "./routes/address.route.js";
import paymentRouter from "./routes/payment.route.js";
import emailRouter from "./routes/email.route.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({ message: "SERVER IS UP & RUNNING......." });
});

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/products", productRouter);
app.use("/wishlist", wishlistRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/banner", bannerRouter);
app.use("/address", addressRouter);
app.use("/payment", paymentRouter);
app.use("/email", emailRouter);
app.use("/", fileRouter);

app.listen(PORT, () => {
  console.log(`SERVER IS UP & RUNNING ON PORT ${PORT}`);
});
