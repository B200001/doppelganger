import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: String,
});

const questionSchema = new mongoose.Schema({
  question_image: { type: String, required: true },
  question_slug: String,
  is_answered: { type: Boolean, default: false },
});

const exampleSchema = new mongoose.Schema({
  example_image: String,
  description: String,
});


const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mainQuestion: { type: String, required: true },
  description: { type: String }, 
  questions: [questionSchema],
  options: [optionSchema],
  examples: [exampleSchema],
  status: { type: String, enum: ['ONGOING', 'UPCOMING'], required: true},
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
