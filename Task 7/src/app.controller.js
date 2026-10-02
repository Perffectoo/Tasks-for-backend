import { BooksRouter } from "./Modules/index.js";

import { connectDB } from "./DB/connections.js";

export const bootstrap = async (app, express) => {

    app.use(express.json());

    await connectDB();

    app.get("/", (req, res) => {
        return res.status(200).json({
            message: "Welcome to the API"
        });
    });

    app.use("/api/v1/books", BooksRouter);

    app.all("/*dummy", (req, res) => {
        return res.status(404).json({
            message: "Not Found Handler!!!"
        });
    });
};