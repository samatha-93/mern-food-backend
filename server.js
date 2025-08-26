// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require('http'); // Needed for Socket.IO
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io'); // For live chat

// Database
const connectDB = require('./config/db');
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/', (req, res) => res.send('API running'));

// ---- SOCKET.IO ----
const server = http.createServer(app); // Wrap Express app
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.to).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on ${PORT}`));
