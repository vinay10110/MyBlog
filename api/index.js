const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
app.use(cors({
  origin: `${process.env.HOST_ADDRESS}`,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.HOST_ADDRESS}`);
  next();
});
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())

// Database connection
mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

// Legacy routes for backward compatibility
app.use('/', authRoutes);
app.use('/', postRoutes);

// ✅ Endpoint for Render Cron Job
app.get('/api/ping-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    console.log("✅ MongoDB ping successful (manual/cron)");
    res.status(200).send({ success: true, message: "MongoDB ping successful" });
  } catch (err) {
    console.error("❌ MongoDB ping failed:", err);
    res.status(500).send({ success: false, message: "MongoDB ping failed" });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
