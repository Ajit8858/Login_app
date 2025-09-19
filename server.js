const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
// app.use(cors({
//   origin: 'http://localhost:3002', // or your frontend IP
// }));
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./authMiddleware');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Routes
app.use('/auth', authRoutes);

// Protected route
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Hello User ${req.user.userId}, you are authenticated.` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
