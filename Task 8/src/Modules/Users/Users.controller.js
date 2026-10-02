import {Router} from "express";
import * as UserService from "./Users.service.js";
const router = Router();

router.post("/createUser", UserService.createUser);
router.post("/Login", UserService.Login);
router.patch("/Update", UserService.updateUser);
router.delete("/Delete", UserService.deleteUser);
router.get("/getUserById", UserService.getUserById);

export default router;