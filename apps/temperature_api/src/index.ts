import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Temperature API is running" });
});

app.get("/temperature", (req: Request, res: Response) => {
  if (!req.query.location) {
    return res.status(400).json({ error: "Location is required" });
  }

  const temperature = Math.floor(Math.random() * 16) + 15;

  res.json({
    value: temperature,
    unit: "°C",
    timestamp: new Date().toISOString(),
    location: req.query.location,
    status: "active",
    sensor_id: "1",
    sensor_type: "temperature",
    description: "Temperature sensor",
  });
});

app.get("/temperature/:id", (req: Request, res: Response) => {
  const sensorId = req.params.id;
  const temperature = Math.floor(Math.random() * 16) + 15;

  res.json({
    value: temperature,
    unit: "°C",
    timestamp: new Date().toISOString(),
    location: `sensor_${sensorId}_location`,
    status: "active",
    sensor_id: sensorId,
    sensor_type: "temperature",
    description: `Temperature sensor ${sensorId}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Temperature API server is running on port ${PORT}`);
});
