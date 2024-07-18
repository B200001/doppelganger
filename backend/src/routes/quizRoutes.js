import express from 'express';
import multer from 'multer';
import { getAllQuizzes, getOneQuiz, createQuiz, updateQuiz, deleteQuiz, submitAnswers } from '../controllers/quizController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', authMiddleware, getAllQuizzes);
router.get('/:id', authMiddleware, getOneQuiz); // Correct endpoint for fetching a single quiz

router.post('/', adminMiddleware, upload.array('images'), createQuiz);
router.put('/:id', adminMiddleware, updateQuiz);
router.delete('/:id', adminMiddleware, deleteQuiz);

router.post('/submit', authMiddleware, submitAnswers);

export default router;
