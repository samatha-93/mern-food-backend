// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require("http");

const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

// Basic health check
app.get('/', (req, res) => res.send('API running'));

// ---- SOCKET.IO ----
const server = http.createServer(app);
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
