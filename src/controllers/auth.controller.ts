import {Request, Response} from "express";
import {IUser, Role, User} from "../modles/user.modle";
import bcrypt from "bcryptjs"
import {ApiResponse} from "../utils/api.response";
import {signAccessToken, signInRefreshToken} from "../utils/tokens";
import {AuthRequest} from "../middlewares/auth";
import jwt from "jsonwebtoken";

export const registerUser = async (req:Request, res:Response) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({email})

        if(existingUser) {
            return ApiResponse.create(res)
                .status(400)
                .withMessage("Email already exists")
                .send()
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            roles: [Role.USER]
        })

        return ApiResponse.create(res)
            .status(201)
            .withMessage("User registered successfully")
            .withData({
                id:user._id,
                name:user.name,
                email:user.email,
                roles:user.roles,
            })
            .send()

    }catch (error:any) {
        return ApiResponse.create(res)
            .status(500)
            .withMessage(error.message)
    }
}

export const login = async (req:Request, res:Response) => {
    try {

        const {email, password} = req.body

        const existingUser = await User.findOne({email})

        if(!existingUser) {
            return ApiResponse.create(res)
                .status(401)
                .withMessage("Invalid credentials")
                .send()
        }

        const valid = await bcrypt.compare(password, existingUser.password)

        if (!valid) {
            return ApiResponse.create(res)
                .status(401)
                .withMessage("Invalid credentials")
                .send()
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signInRefreshToken(existingUser)

        ApiResponse.create(res)
            .status(200)
            .withMessage("Logged in successfully")
            .withData({
                email: existingUser.email,
                roles: existingUser.roles,
                accessToken,
                refreshToken
            })
            .send()
    }catch (error:any) {
        return ApiResponse.create(res)
            .status(500)
            .withMessage(error.message)
            .send()
    }

}

export const getMyProfile = async (req:AuthRequest, res:Response) => {

    try {
        if (!req.user) {
            return ApiResponse.create(res).status(401).withMessage("Unauthorized").send()
        }
        const user = await User.findById(req.user.sub).select("-password")

        if (!user) {
            return ApiResponse.create(res).status(404).withMessage("User not found").send()
        }

        ApiResponse.create(res).status(200).withData(user).send()
    }catch (error:any) {
        ApiResponse.create(res).status(500).withMessage(error.message).send()
    }

}

export const refreshToken = async (req:Request, res:Response) => {
    try {
        const {token} = req.body
        if (!token) {
            return ApiResponse.create(res).status(401).withMessage("No Token Provided").send()
        }

        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string)

        const user = await User.findById(payload.sub)

        if (!user) {
            return ApiResponse.create(res).status(404).withMessage("User not found").send()
        }

        const accessToken = signAccessToken(user)

        ApiResponse.create(res).status(200).withData({accessToken}).send()

    }catch (error:any) {
        ApiResponse.create(res).status(500).withMessage(error.message).send()

    }
}