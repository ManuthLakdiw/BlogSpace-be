import {Router} from "express";
import {createPost, getAllPosts, getLatestThreePosts, getMyPosts} from "../controllers/post.controller";
import {authenticate} from "../middlewares/auth";
import {requireRole} from "../middlewares/role";
import {Role} from "../modles/user.modle";
import {upload} from "../middlewares/upload";

const router = Router();

router.post("/create", authenticate, requireRole([Role.AUTHOR]), upload.single("image"), createPost)

router.get("/" , getAllPosts)

router.get("/latest", getLatestThreePosts)

router.get("/me", authenticate, requireRole([Role.AUTHOR,Role.ADMIN]), getMyPosts)

export default router;