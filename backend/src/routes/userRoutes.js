import express from 'express';
import { registerUser, loginUser, getUserProfile, getUserAnswers, updateProfilePicture, updateUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route - requires authentication for all users
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile/picture', authMiddleware, updateProfilePicture);
router.get('/answers', authMiddleware, getUserAnswers);
router.put('/update', authMiddleware, updateUser); 

export default router;


