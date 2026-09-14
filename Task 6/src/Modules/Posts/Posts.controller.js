import {Router} from "express";
import * as PostsService from "./Posts.service.js";
const router = Router();

router.post("/create",PostsService.createPost);
router.delete("/delete/:id",PostsService.deletePost);
router.get("/details", PostsService.getPostsDetails);

router.get("/comment-count", PostsService.getPostsCommentCount);

export default router;