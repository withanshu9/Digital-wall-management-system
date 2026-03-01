require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const wallRoutes = require('./routes/wallRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const cron = require('node-cron');
const Wall = require('./models/Wall');
const Booking = require('./models/Booking');

app.use('/api/auth', authRoutes);
app.use('/api/walls', wallRoutes);
app.use('/api/bookings', bookingRoutes);

// Cron Job: Run every midnight to check for expired bookings
cron.schedule('0 0 * * *', async () => {
  console.log('[Cron Job] Checking for expired bookings...');
  try {
    const now = new Date();
    // Find approved bookings where endDate has passed
    const expiredBookings = await Booking.find({
      status: 'approved',
      endDate: { $lt: now }
    });

    for (let booking of expiredBookings) {
      // Update booking status to completed
      booking.status = 'completed';
      await booking.save();

      // Make the wall available again
      await Wall.findByIdAndUpdate(booking.wall, { availability: 'available' });
      console.log(`[Cron Job] Completed booking ${booking._id}, Relisted wall ${booking.wall}`);
    }
    console.log(`[Cron Job] Processed ${expiredBookings.length} expired bookings.`);
  } catch (err) {
    console.error('[Cron Job] Error processing expired bookings:', err);
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'DWMS API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
