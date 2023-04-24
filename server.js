import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";

dotenv.config();

// connect the db from mongoose
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.get("/", (req, res) => {
  res.send("Api is running..");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
// change port to 5000 when merging
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold
  )
);
