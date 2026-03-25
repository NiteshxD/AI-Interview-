import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import socketHandler from './socket/socketHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', timestamp: new Date().toISOString() });
});

// DB check middleware - returns clear error when MongoDB is not connected
const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected. Please configure MONGODB_URI in server/.env with a valid MongoDB Atlas connection string.' });
  }
  next();
};

// Routes
app.use('/api/auth', requireDB, authRoutes);
app.use('/api/interview', requireDB, interviewRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/resume', requireDB, resumeRoutes);
app.use('/api/dashboard', requireDB, dashboardRoutes);

// Error handler
app.use(errorHandler);

// Socket.io handler
socketHandler(io);

// Start server
const PORT = parseInt(process.env.PORT, 10) || 5000;

const listen = (port) => {
  httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📡 Socket.io ready`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} in use, trying ${port + 1}...`);
      listen(port + 1);
    } else {
      console.error(err);
    }
  });
};

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');
  } catch (error) {
    console.warn(`⚠️  Starting without DB: ${error.message}`);
    console.warn('   → Set MONGODB_URI in .env to enable auth/data features');
  }
  listen(PORT);
};


startServer();
