import Quiz from '../models/Quiz.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';

// Define the shuffleArray function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all quizzes
    const quizzes = await Quiz.find();

    // Fetch all answers for the current user
    const userAnswers = await Answer.find({ userId });

    console.log('User Answers:', userAnswers); // Log user answers

    // Extract imageUrls from answers
    const answeredImageUrls = userAnswers.map(answer => answer.imageUrl);

    console.log('Answered Image URLs:', answeredImageUrls); // Log answered image URLs

    // Filter out questions with answered image URLs and shuffle the questions
    const quizzesWithUnansweredQuestions = quizzes.map(quiz => {
      let unansweredQuestions = quiz.questions.filter(question => !answeredImageUrls.includes(question.question_image));
      unansweredQuestions = shuffleArray(unansweredQuestions);
      return { ...quiz.toObject(), questions: unansweredQuestions };
    });

    console.log('Quizzes with unanswered questions:', quizzesWithUnansweredQuestions); // Debug log
    res.status(200).json(quizzesWithUnansweredQuestions);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const getOneQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, mainQuestion, options } = req.body;
    const images = req.files;

    const formattedQuestions = images.map(image => ({
      question_image: image.path,
      question_slug: generateSlug(image.filename),
    }));

    const newQuiz = new Quiz({
      title,
      mainQuestion,
      options: options.map(option => ({ text: option })),
      questions: formattedQuestions,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, mainQuestion, options } = req.body;

    await Quiz.findByIdAndUpdate(id, {
      title,
      mainQuestion,
      options: options.map(option => ({ text: option })),
    });
    res.status(200).json({ message: 'Quiz updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findByIdAndDelete(id);
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const submitAnswers = async (req, res) => {
  try {
    const { quizId, questionIndex, questionId, answers, email, imageUrl, unlistedFeature } = req.body;
    if (!quizId || !questionId || !imageUrl) {
      return res.status(400).json({ message: 'Quiz ID, Question ID, and Image URL are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const questionSlug = generateSlug(`dataset-${quizId}-image-${imageUrl}`);
    const imageName = imageUrl.split('/').pop();
    const listedAns = Object.keys(answers).filter(key => answers[key] === true);

    const newAnswer = new Answer({
      user: user.user,
      dataset: "hsc_data",
      image_name: imageName,
      listed_ans: listedAns,
      unlisted_ans: unlistedFeature || "None",
      question_slug: questionSlug,
      ans_time: new Date(),
    });

    await newAnswer.save();
    res.status(200).json({ message: 'Answer submitted successfully', slug: questionSlug });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};



const generateSlug = (text) => {
  const randomInt = Math.floor(1000 + Math.random() * 9000);
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '') + '-' + randomInt;
};

export { getAllQuizzes, getOneQuiz, createQuiz, updateQuiz, deleteQuiz, submitAnswers };
