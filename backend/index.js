import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import filesRouter from "./routes/files.js";

const PORT = process.env.PORT;
const app = express();

// ✅ JSON body 파서
app.use(express.json());

// ✅ CORS 설정
app.use(
    cors({
        origin: process.env.FRONT_ORIGIN,
        credentials: true,
    })
);

// ✅ 라우터 등록
app.use("/api/files", filesRouter);

// ✅ 기본 라우트
app.get("/", (req, res) => {
    res.send("Hello world");
});

// ✅ 서버 실행 (Mongo 연결 후 실행되도록)
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ MongoDB 연결 실패", err);
        process.exit(1);
    }
};

startServer();
