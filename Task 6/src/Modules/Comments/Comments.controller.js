import { Router } from "express";

import * as CommentsService from "./Comments.service.js";

const router = Router();

router.post("/create", CommentsService.createComments);

router.patch("/update/:commentId", CommentsService.updateComment);

router.post("/find-or-create", CommentsService.findOrCreateComment);

router.get("/search", CommentsService.searchComments);

router.get("/newest/:postId", CommentsService.getNewestComments);

export default router;