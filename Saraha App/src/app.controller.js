import { authRouter, messageRouter, userRouter } from "./Modules/index.js";
import { successResponse } from "./Utils/response/success.response.js";
import {
  BadRequestException,
  globalErrorHandler,
} from "./Utils/response/error.response.js";
import connectDB from "./DB/connections.js";
import cors from "cors";
import { sendEmail } from "./Utils/email/nodemailer.emai.js";
import path from "node:path";
import { redisconnection } from "./DB/redis.connection.js";
import { corsOptions } from "./Utils/cors/cors.js";
import helmet from "helmet";
import morgan from "morgan";
import { attachMorganLogger } from "./Utils/loggers/morgan.logger.js";
import rateLimit from "express-rate-limit";
const bootstrap = async (app, express) => {
  app.use(express.json(), cors(corsOptions()),helmet());

  await connectDB();
  await redisconnection();

  app.get("/", (req, res) => {
    successResponse({
      res,
      statusCode: 200,
      message: "Welcome to Saraha API",
      data: { message: "Welcome to Saraha API" },
    });
  });

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use(limiter);
  
attachMorganLogger(app, "/api/v1/auth", authRouter, "auth.log");
attachMorganLogger(app, "/api/v1/users", userRouter, "user.log");
attachMorganLogger(app, "/api/v1/messages", messageRouter, "message.log");

  app.use("/upload", express.static(path.resolve("./src/uploads")));
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/messages", messageRouter);

  app.all("/*dummy", (req, res) => {
    throw BadRequestException({ message: "Not found Handler!!" });
  });

  app.use(globalErrorHandler);
};

export default bootstrap;
