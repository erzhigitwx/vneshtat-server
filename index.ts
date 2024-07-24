import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { PORT } from "./constants/index.js";
import { db } from "./database/index.js";
import citiesRouter from "./routes/cities.route.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use("/api", citiesRouter);

(async () => {
    try {
        await db.getConnection();
        console.log("Database connection is successful!");
    } catch (error) {
        console.error("Error connecting to the database:", error.message, error.stack);
    }
})();

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

export default app;
