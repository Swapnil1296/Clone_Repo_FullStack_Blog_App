import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/createPostRoute.js";
import commentRoutes from "./routes/comment.route.js";
import recoveryRoutes from "./routes/recovery.routes.js";
import path from "path";

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
const port = process.env.PORT || 3002;
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

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/recover", recoveryRoutes);


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
