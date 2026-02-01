import express from "express";
import {config} from "dotenv";
import cors from "cors";
import { dbConnect } from "./lib/dbConnect";
import {router as imageRoutes} from "./routes/imageRouter";
import {router as authRoutes} from "./routes/authRoutes";

const app = express()

config()
const PORT = process.env.PORT || 4000
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({limit: "10mb", extended: true}))
app.use(cors())
app.use('/api/images', imageRoutes)
app.use('/api/auth', authRoutes)

dbConnect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);    
    })
})