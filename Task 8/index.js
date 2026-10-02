import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
const PORT = process.env.PORT;

bootstrap(app, express);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});