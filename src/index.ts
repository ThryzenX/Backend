import express from 'express';
import userRoutes from './modules/routes/user.route'; // 👈 notice: NOT the controller!

const app = express();
app.use(express.json());

app.use('/api', userRoutes); // ✅ pass the Router, not the controller

app.listen(4000, () => {
  console.log(`✅ Server running 3000`);
});
