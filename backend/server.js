import express from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import classRoutes from "./routes/class.route.js";
import sessionRoutes from "./routes/session.route.js";
import chatRoutes from "./routes/chat.route.js";



import cors from "cors"

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "https://lecture-hub.vercel.app" // production
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


// Routes
app.get('/', (req, res) => res.send('server is running'));
app.use("/api/auth", authRoutes);
app.use("/api/class", classRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);




const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})