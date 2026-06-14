import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { SocketService } from './services/socketService';

// Load Env variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillchef';

// Create Server
const server = http.createServer(app);

// Initialize Socket.IO
SocketService.init(server);

// Connect to MongoDB & Start Listening
console.log('Connecting to database...');
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed, starting server in offline mode:', err.message);
    // Even if DB fails, let server start for frontend responsiveness
    server.listen(PORT, () => {
      console.log(`Server running in offline-demo mode on port ${PORT}`);
    });
  });
