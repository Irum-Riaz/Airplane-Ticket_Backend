import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import flightRoute from "./Routes/flights.js";
import bookingRoute from "./Routes/booking.js";
import ticketRoute from "./Routes/tickets.js";
import multer from "multer";
// import { createCanvas, loadImage } from "canvas";
import jsQR from "jsqr"; // Make sure to install jsQR library
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const corsOptions = {
//   origin: true,
// };
server.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
// app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


app.get("/", (req, res) => {
  res.send("api is working");
});

app.get("/test", (req, res) => {
  res.send("test api is working");
});

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

app.post("/api/v1/decode-qr", upload.single("image"), async (req, res) => {
  try {
    const imageData = req.file.buffer;
    const qrData = await decodeQRFromImage(imageData);
    if (qrData) {
      res.json({ status: true, data: qrData });
    } else {
      res.status(404).json({ status: false, message: "No QR code detected" });
    }
  } catch (error) {
    console.error("Error decoding QR code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// async function decodeQRFromImage(imageData) {
//   try {
//     const image = await loadImage(imageData);
//     const canvas = createCanvas(image.width, image.height);
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(image, 0, 0);
//     const imageDataCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const code = jsQR(
//       imageDataCanvas.data,
//       imageDataCanvas.width,
//       imageDataCanvas.height
//     );
//     if (code) {
//       return code.data;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error decoding QR code from image:", error);
//     throw error;
//   }
// }

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/flights", flightRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/tickets", ticketRoute);

// app.listen(5000, () => {
//   connectDB();
//   console.log("Server is running on port 5000");
// });


try {
  app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
  })
} catch (e) {
  console.error(e.message)
}