import express from 'express'
import mongoose from 'mongoose'
import dotenv from "dotenv";
import authRouter from "./routes/auth.router";
import postRouter from "./routes/post.router";
import cors from "cors"
import aiRouter from "./routes/ai.router";
dotenv.config();

const app = express()

app.use(express.json())

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)


app.get("/", (req, res) => {
    res.status(200).send("Welcome to the server")
})

app.use("/api/v1/auth", authRouter)

app.use("/api/v1/post", postRouter)

app.use("/api/v1/ai", aiRouter)


mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
    })




if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.POR}`);
    });
}