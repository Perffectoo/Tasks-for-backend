import { connectDB, syncTables } from "./DB/connections.js";
import { PostsRouter, CommentsRouter, UsersRouter } from "./Modules/index.js";
import { PostsModel } from "./DB/Models/Posts.js";
import { CommentsModel } from "./DB/Models/Comments.js";
import { UsersModel } from "./DB/Models/Users.js";
export const bootstrap = async (app, express) => {
  app.use(express.json());
  await connectDB();
  await syncTables();


  app.get("/", (req, res) => {
    return res.status(200).json({
      message: "Welcome to the API",
    });
  });




  app.use("/api/v1/posts", PostsRouter);
  app.use("/api/v1/comments", CommentsRouter);
  app.use("/api/v1/users", UsersRouter);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({
      message: "Not Found Handler!!!",
    });
  });
};
