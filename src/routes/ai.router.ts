import {Router} from "express";
import {generateContent} from "../controllers/ai.controller";

const router = Router();

router.get("/generate", generateContent);

export default router;