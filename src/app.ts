import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorMiddleware);

export default app;
