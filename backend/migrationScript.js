import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './src/models/Quiz.js'; // Adjust the import path as necessary

dotenv.config();

const migrateQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const quizzes = await Quiz.find();

    for (const quiz of quizzes) {
      if (quiz.questions && quiz.questions.length > 0) {
        // Set the main question
        const mainQuestion = "Identify the features in this galaxy image.";

        // Remove the question field from each question in the questions array
        const updatedQuestions = quiz.questions.map((q) => ({
          question_image: q.question_image,
          question_slug: q.question_slug,
          is_answered: q.is_answered,
          _id: q._id
        }));

        quiz.mainQuestion = mainQuestion;
        quiz.questions = updatedQuestions;
        quiz.options = [
          { text: 'Spiral' },
          { text: 'Bar' },
          { text: 'EdgeOn' },
          { text: 'Ring' },
          { text: 'Interacting Galaxies' },
          { text: 'Tidal Tails' },
          { text: 'Galaxy Group' },
          { text: 'Mergers' },
          { text: 'Smooth' },
          { text: 'Do you see any feature not listed above' },
        ];

        await quiz.save();
        console.log(`Updated quiz: ${quiz.title}`);
      }
    }

    console.log('Quiz migration completed.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during quiz migration:', error);
  }
};

migrateQuizzes();
