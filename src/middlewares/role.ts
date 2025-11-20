import { Role } from "../modles/user.modle";
import {AuthRequest} from "./auth";
import {ApiResponse} from "../utils/api.response";
import {Response,NextFunction} from "express";

export const requireRole = (roles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return ApiResponse.create(res)
            .status(401)
            .withMessage("Unauthorized")
            .send()
        }

        const hasRole = roles.some(role => req.user.roles?.includes(role));

        if (hasRole) {
            return next();
        }

        return ApiResponse.create(res)
            .status(403)
            .withMessage("Forbidden")
            .send()


    }
};