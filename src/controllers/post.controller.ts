import {AuthRequest} from "../middlewares/auth";
import {Request, NextFunction, Response} from "express";
import cloudinary from "../config/cloudinary.config"
import {Post} from "../modles/post.modle";
import {ApiResponse} from "../utils/api.response";

export const createPost = async (req:AuthRequest,res:Response) => {
    try {
        const {title,content,tags} = req.body

        const userId = req.user.sub
        let imageURL;

        if (req.file) {
            const result:any = await new Promise((resolve, reject) => {
                const UPLOAD_STREAM = cloudinary.uploader.upload_stream({folder: "space-blog-posts"}, (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        console.log(result);
                        resolve(result);
                    }
                })
                UPLOAD_STREAM.end(req?.file?.buffer)
            })
           imageURL = result.secure_url;
        }

        const newPost = new Post({
            title,
            content,
            tags: tags.split(","),
            imageURL,
            author:userId
        })

        await newPost.save()

        ApiResponse.create(res)
            .status(201)
            .withMessage("Post created successfully")
            .withData(newPost)
            .send()

    }catch (error:any) {
        console.log(error)
        return ApiResponse.create(res)
            .status(500)
            .withMessage(error.message)
            .send()
    }

}


export const getAllPosts = async (req:AuthRequest, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const skip = (page - 1) * limit

        const posts = await Post.find()
                .skip(skip)
            .limit(limit)
            .populate("author", "name")
            .sort({createdAt:-1})


        const totalPosts = await Post.countDocuments()

        ApiResponse.create(res)
            .status(200)
            .withMessage("Posts fetched successfully")
            .withData({
                posts,
                totalPosts: Math.ceil(totalPosts / limit),
                current:page
            })
            .send()
    }catch (error:any) {
        return ApiResponse.create(res)
        .status(500)
        .withMessage(error.message)
        .send()
    }

}


export const getMyPosts = async (req:AuthRequest, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const skip = (page - 1) * limit

        const posts = await Post.find({author:req.user.sub})
            .skip(skip)
            .limit(limit)
            .populate("author", "name")
            .sort({createdAt:-1})


        const totalPosts = await Post.countDocuments({author:req.user.sub})

        ApiResponse.create(res)
            .status(200)
            .withMessage("Posts fetched successfully")
            .withData({
                posts,
                totalPosts: Math.ceil(totalPosts / limit),
                current:page
            })
            .send()
    }catch (error:any) {
        return ApiResponse.create(res)
            .status(500)
            .withMessage(error.message)
            .send()
    }

}

export const getLatestThreePosts = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const posts = await Post.find().sort({createdAt:-1}).limit(3).populate("author", "name")

        ApiResponse.create(res).status(200).withData(posts).send()

    }catch (error:any) {
        ApiResponse.create(res)
        .status(500)
        .withMessage(error.message)
    }

}