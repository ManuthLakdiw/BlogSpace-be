import {Request,Response,NextFunction} from "express";
import {ApiResponse} from "../utils/api.response";
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: any
}

export const authenticate = (req:AuthRequest, res:Response, next:NextFunction) => {
    const authHeader = req.headers?.authorization

    if (!authHeader) {
        return ApiResponse.create(res)
            .status(401)
            .withMessage("No Token Provided")
            .send()
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();

    }catch (error) {
        return ApiResponse.create(res)
            .status(401)
            .withMessage("Invalid or expire token")
            .send()
    }

}