import express from 'express';
import { 
  getQuizById, 
  editQuiz, 
  loginAdmin, 
  deleteQuiz, 
  getTotalQuestions, 
  removeImageAndQuestions, 
  getUserDetails, 
  getRemovedImagesWithAnswers, 
  getAllUsers, 
  getAnswerCounts, 
  addExamplesToQuiz,
  removeExampleFromQuiz,
  getRemovedImages, 
  deleteUser, 
  getAdmin, 
  getUserAnswers, 
  getAllAnswers, 
  getUsers, 
  getAllUserAnswers, 
  getAnswerById, 
  searchAnswers, 
  addImagesToQuiz, 
  getQuizzes, 
  createQuiz 
} from '../controllers/adminController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'public/images/' });

router.post('/login', loginAdmin);

router.get('/dashboard', adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard', admin: req.admin });
});

router.get('/users', adminMiddleware, getUsers);
router.get('/users/:userId', getUserDetails);
router.delete('/users/:userId', deleteUser);

router.get('/users/:userId/answers', adminMiddleware, getUserAnswers);
router.get('/answers', adminMiddleware, getAllUserAnswers);
router.get('/answers/search', adminMiddleware, searchAnswers);
router.get('/answer-counts', adminMiddleware, getAnswerCounts);
router.get('/removed-images', adminMiddleware, getRemovedImagesWithAnswers);
router.get('/answers/all', adminMiddleware, getAllAnswers);
router.get('/total-questions', adminMiddleware, getTotalQuestions);
router.get('/users/all', getAllUsers);
router.get('/answers/:answerId', adminMiddleware, getAnswerById);
router.post('/remove-image', adminMiddleware, removeImageAndQuestions);
router.post('/add-images-to-quiz', adminMiddleware, upload.array('images', 10), addImagesToQuiz);
router.post('/add-examples-to-quiz', adminMiddleware, upload.array('examples', 10), addExamplesToQuiz);
router.delete('/remove-example/:quizId', adminMiddleware, removeExampleFromQuiz);
router.get('/quizzes', adminMiddleware, getQuizzes);
router.post('/create-quiz', adminMiddleware, createQuiz);
router.put('/edit-quiz/:quizId', adminMiddleware, editQuiz);
router.get('/quizzes/:quizId', adminMiddleware, getQuizById);
router.delete('/delete-quiz/:quizId', adminMiddleware, deleteQuiz);

export default router;
