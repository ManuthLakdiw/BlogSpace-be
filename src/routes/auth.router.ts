import {Router} from "express";
import {getMyProfile, login, refreshToken, registerUser} from "../controllers/auth.controller";
import {authenticate} from "../middlewares/auth";
import {requireRole} from "../middlewares/role";
import {Role} from "../modles/user.modle";

const router = Router();

router.post("/register", registerUser)

router.post("/login", login)

router.get("/me", authenticate, requireRole([Role.AUTHOR,Role.ADMIN]), getMyProfile)

router.post("/refresh", refreshToken)

export default router;