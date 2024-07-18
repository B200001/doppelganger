import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Answer from '../models/Answer.js';
import RemovedImage from '../models/RemovedImage.js';
import Quiz from '../models/Quiz.js';
import { generateToken } from '../utils/tokenUtils.js';
import fs from 'fs';
import path from 'path';

const generateSlug = (imageUrl) => {
  const imageName = imageUrl.split('/').pop();
  const slug = imageName.replace(/\.[^/.]+$/, "") + '-' + Math.floor(100000 + Math.random() * 900000);
  return slug;
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(admin._id, true);
    res.status(200).json({ token, adminId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const searchAnswers = async (req, res) => {
  try {
    const { query, startDate, endDate } = req.query;
    const searchCriteria = {};

    if (query) {
      const users = await User.find({
        $or: [{ user: parseInt(query) }]
      }).select('user username');

      const userNumbers = users.map(user => user.user);
      searchCriteria.user = { $in: userNumbers };
    }

    if (startDate || endDate) {
      searchCriteria.ans_time = {};
      if (startDate) {
        searchCriteria.ans_time.$gte = new Date(startDate);
      }
      if (endDate) {
        searchCriteria.ans_time.$lte = new Date(endDate);
      }
    }

    const answers = await Answer.find(searchCriteria);
    const populatedAnswers = await Promise.all(
      answers.map(async (answer) => {
        const user = await User.findOne({ user: answer.user }).select('username');
        return {
          ...answer.toObject(),
          username: user ? user.username : 'Unknown',
        };
      })
    );

    res.status(200).json(populatedAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getAdmin = async (req, res) => {
  res.json("GetAdmin");
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const cacheKey = `users:${page}:${limit}:${search}`;
    const redisClient = req.app.locals.redisClient;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Data retrieved from Redis cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    const query = {};

    if (search) {
      const searchQuery = [
        { username: { $regex: search, $options: 'i' } }
      ];
      if (!isNaN(search)) {
        searchQuery.push({ user: parseInt(search, 10) });
      }
      query.$or = searchQuery;
    }

    console.log('Query:', query); // Add logging to verify the query

    const users = await User.find(query)
      .select('username email user')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const count = await User.countDocuments(query);

    const userNumbers = users.map(user => user.user);
    const answerCounts = await Answer.aggregate([
      { $match: { user: { $in: userNumbers } } },
      { $group: { _id: '$user', count: { $sum: 1 } } }
    ]);

    const usersWithAnswerCount = users.map(user => {
      const answerCount = answerCounts.find(count => count._id === user.user);
      return { ...user, answerCount: answerCount ? answerCount.count : 0 };
    });

    const response = {
      users: usersWithAnswerCount,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Setex should be setEx
    console.log('Data stored in Redis cache');

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', error); // Add detailed error logging
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('username email');
    res.status(200).json(users.length);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getUserAnswers = async (req, res) => {
  try {
    const { userId } = req.params;
    const answers = await Answer.find({ userId })
      .populate('quizId', 'title questions')
      .populate('userId', 'username email');

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({});
    const formattedAnswers = answers.map(answer => ({
      _id: answer._id,
      user: answer.user,
      dataset: answer.dataset,
      image_name: answer.image_name,
      listed_ans: answer.listed_ans,
      unlisted_ans: answer.unlisted_ans,
      question_slug: answer.question_slug,
      ans_time: answer.ans_time,
    }));

    res.status(200).json(formattedAnswers);
  } catch (error) {
    console.error('Failed to fetch all answers:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getAllUserAnswers = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const answers = await Answer.find().skip(skip).limit(Number(limit));
    const totalAnswers = await Answer.countDocuments();

    const populatedAnswers = await Promise.all(
      answers.map(async (answer) => {
        const user = await User.findOne({ user: answer.user }).select('username');
        return { ...answer.toObject(), username: user ? user.username : 'Unknown User' };
      })
    );

    res.status(200).json({
      answers: populatedAnswers,
      totalPages: Math.ceil(totalAnswers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getAnswerById = async (req, res) => {
  try {
    const { answerId } = req.params;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status (500).json({ message: 'Failed to delete user' });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const answerCount = await Answer.countDocuments({ user: user.user });

    res.status(200).json({ user, answerCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


const getTotalQuestions = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
    res.status(200).json({ totalQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total questions', error: error.message });
  }
};


const getAnswerCounts = async (req, res) => {
  try {
    const { page = 1, filter = '' } = req.query;
    const limit = 50;
    const filterRegex = new RegExp(filter, 'i');

    const matchStage = filter
      ? { $match: { image_name: { $regex: filterRegex } } }
      : {};

    const pipeline = [
      matchStage,
      {
        $group: {
          _id: '$image_name',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ].filter(stage => Object.keys(stage).length > 0);

    const answerCounts = await Answer.aggregate(pipeline);

    const totalAnsweredQuestions = await Answer.countDocuments(matchStage.$match || {});

    const removedImages = [];
    const filteredAnswerCounts = answerCounts.filter(count => !removedImages.includes(count._id));

    res.status(200).json({
      answerCounts: filteredAnswerCounts,
      totalPages: Math.ceil(totalAnsweredQuestions / limit),
      totalAnsweredQuestions,
      removedImages,
    });
  } catch (error) {
    console.error('Error fetching answer counts:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


const getRemovedImages = async (req, res) => {
  try {
    const cacheKey = 'removedImages';
    const redisClient = req.app.locals.redisClient;

    const cachedImages = await redisClient.get(cacheKey);

    if (cachedImages) {
      return res.status(200).json(JSON.parse(cachedImages));
    }

    const images = await RemovedImage.find().sort({ removedAt: -1 });
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(images)); // Cache for 1 hour

    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching removed images:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const getRemovedImagesWithAnswers = async (req, res) => {
  try {
    const removedImages = await RemovedImage.find()
      .populate({
        path: 'answers',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username email',
        },
      });

    for (const removedImage of removedImages) {
      if (!removedImage.answers.length) {
        const answers = await Answer.find({ image_name: removedImage.imageName })
          .populate('user', 'username email')
          .exec();

        removedImage.answers = answers;
        await removedImage.save();
      }
    }

    res.status(200).json(removedImages);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const removeImageAndQuestions = async (req, res) => {
  try {
    const { imageName } = req.body;

    const quizzes = await Quiz.find({ 'questions.question_image': `public/images/${imageName}` });

    const removedQuestions = [];

    for (const quiz of quizzes) {
      const questionsToRemove = quiz.questions.filter(q => q.question_image === `public/images/${imageName}`);
      removedQuestions.push(...questionsToRemove);
      quiz.questions = quiz.questions.filter(q => q.question_image !== `public/images/${imageName}`);
      await quiz.save();
    }

    const removedImage = new RemovedImage({
      imageName,
      answers: removedQuestions,
    });
    await removedImage.save();

    res.status(200).json({ message: 'Image and related questions removed from quizzes successfully' });
  } catch (error) {
    console.error('Error removing image and questions:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, mainQuestion, options, examples, description, status } = req.body;

    // Validate required fields
    if (!title || !mainQuestion || !options || !description || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newQuiz = new Quiz({
      title,
      mainQuestion,
      options: options.map(option => ({ text: option })),
      examples: examples.map(example => ({ example_image: example.example_image, description: example.description })),
      description,
      status,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const editQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, mainQuestion, options, description, status } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, mainQuestion, options, description, status },
      { new: true }
    );

    res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
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
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const addImagesToQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;
    const files = req.files;

    if (!quizId || !files || files.length === 0) {
      return res.status(400).json({ message: 'Quiz ID and images are required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const newQuestions = files.map(file => ({
      question_image: file.path,
      question_slug: generateSlug(file.path),
      is_answered: false,
    }));

    quiz.questions.push(...newQuestions);
    await quiz.save();

    // Invalidate the cache if using Redis
    if (req.redisClient) {
      await req.redisClient.del('quizzes');
    }

    res.status(200).json({ message: 'Images added to quiz successfully', quiz });
  } catch (error) {
    console.error('Error adding images to quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const addExamplesToQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;
    const files = req.files;

    if (!quizId || !files || files.length === 0) {
      return res.status(400).json({ message: 'Quiz ID and examples are required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const newExamples = files.map(file => ({
      example_image: file.path,
      description: file.originalname.split('.')[0], // Use the file name (without extension) as the description
    }));

    quiz.examples.push(...newExamples);
    await quiz.save();

    // Invalidate the cache if using Redis
    if (req.redisClient) {
      await req.redisClient.del('quizzes');
    }

    res.status(200).json({ message: 'Examples added to quiz successfully', quiz });
  } catch (error) {
    console.error('Error adding examples to quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

const removeExampleFromQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { examples } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { examples },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Example removed successfully', quiz: updatedQuiz });
  } catch (error) {
    console.error('Error removing example from quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};



const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    await Quiz.findByIdAndDelete(id);
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


export {
  loginAdmin,
  removeImageAndQuestions,
  getRemovedImagesWithAnswers,
  getUserDetails,
  getAllUsers,
  getAnswerCounts,
  getAdmin,
  getUserAnswers,
  getRemovedImages,
  getUsers,
  getAllAnswers,
  getAllUserAnswers,
  getAnswerById,
  deleteUser,
  searchAnswers,
  addImagesToQuiz,
  getQuizzes,
  getQuizById,
  createQuiz,
  getOneQuiz,
  editQuiz,
  deleteQuiz,
  getTotalQuestions,
  addExamplesToQuiz,
  removeExampleFromQuiz
};
