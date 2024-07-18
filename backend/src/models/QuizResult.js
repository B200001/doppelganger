import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Map, of: Boolean, required: true },
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;