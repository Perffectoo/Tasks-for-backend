import {Router} from "express";
import * as UserService from "./Users.service.js";
const router = Router();

router.post("/create",UserService.CreateUser);
router.patch("/update/:id",UserService.UpdateUser);
router.get("/by-email",UserService.GetUserByEmail);
router.get("/:id",UserService.GetUserId);

export default router;