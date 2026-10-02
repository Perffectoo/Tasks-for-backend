// import { connectDB, syncTables } from "./DB/connections.js";
// // import { PostsRouter, CommentsRouter, UsersRouter } from "./Modules/index.js";
import { BooksRouter } from "./Modules/index.js";
import { UsersRouter } from "./Modules/index.js";
// import { PostsModel } from "./DB/Models/Posts.js";
// import { CommentsModel } from "./DB/Models/Comments.js";
// import { UsersModel } from "./DB/Models/Users.js";
import connectDB from './DB/connections.js';



export const bootstrap = async (app, express) => {
  app.use(express.json());
  await connectDB();
  app.get("/", (req, res) => {
    return res.status(200).json({
      message: "Welcome to the API",
    });
  });

  app.use("/api/v1/books", BooksRouter);
  app.use("/api/v1/users", UsersRouter);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({
      message: "Not Found Handler!!!",
    });
  });
};
