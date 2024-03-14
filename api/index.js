import express from "express";
import mongoose from "mongoose";


import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/createPostRoute.js";
import commentRoutes from "./routes/comment.route.js";
import recoveryRoutes from "./routes/recovery.routes.js";
import path from "path";

dotenv.config();
const app = express();

const port = 3000;
mongoose
  .connect(process.env.MONGO)
  .then((x) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error while connecting to db", error);
  });

app.listen(3000, () => {
  console.log(`server is running on  ${port}`);
});
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/recover", recoveryRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.get("/", (req, res) => {
  const sessionData = req.session;
  console.log(sessionData);

  // Access session data
});
// customize middleware to send the error response to every controller using next()
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorMessage,
  });
});
