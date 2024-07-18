import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import Answer from '../models/Answer.js';
import { generateToken } from '../utils/tokenUtils.js';
import { promisify } from 'util';
import multer from 'multer';
import { fileURLToPath } from 'url'; 
import path from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Register User
const generateSlug = (text) => {
  const randomInt = Math.floor(1000 + Math.random()*9000); // Generate a random 4-digit integer
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') + '-' + randomInt; // Trim - from end of text and add random integer
};

const registerUser = async (req, res) => {
  try {
    const { username, password, email, ...registrationData } = req.body;

    // Check if a user with the same username or email exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get the highest user number in the current collection
    const maxUser = await User.findOne().sort({ user: -1 }).select('user').exec();
    const newUserNumber = maxUser && maxUser.user ? maxUser.user + 1 : 1;

    // Generate profile slug
    const profileSlug = generateSlug(username);

    // Create a new user
    const newUser = new User({
      ...registrationData,
      username,
      password: hashedPassword,
      email,
      registration_date: new Date(),
      user: newUserNumber, // Assign the new user number
      profile_slug: profileSlug, // Assign the generated profile slug
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const pbkdf2 = promisify(crypto.pbkdf2);

const identifyHasher = (encoded) => {
  if (encoded.startsWith('pbkdf2_sha256$')) {
    return 'pbkdf2_sha256';
  } else if (encoded.startsWith('$2b$') || encoded.startsWith('$2a$') || encoded.startsWith('$2y$')) {
    return 'bcrypt';
  } else if (encoded.startsWith('sha1$$')) {
    return 'unsalted_sha1';
  }
  throw new Error('Unknown hasher');
};

const verifyPassword = async (password, encoded) => {
  const hasher = identifyHasher(encoded);
  console.log(`Identified hasher: ${hasher}`);
  
  if (hasher === 'bcrypt') {
    return await bcrypt.compare(password, encoded);
  } else if (hasher === 'pbkdf2_sha256') {
    console.log(`Encoded value: ${encoded}`);
    const parts = encoded.split('$');
    console.log(`PBKDF2 parts: ${parts}`);
    if (parts.length !== 4) {
      throw new Error('Invalid PBKDF2 format');
    }
    const [algorithm, iterations, salt, hash] = parts;
    if (!algorithm || !iterations || !salt || !hash) {
      console.error(`Invalid PBKDF2 parts - Algorithm: ${algorithm}, Iterations: ${iterations}, Salt: ${salt}, Hash: ${hash}`);
      throw new Error('Invalid PBKDF2 parts');
    }
    console.log(`Algorithm: ${algorithm}, Iterations: ${iterations}, Salt: ${salt}, Hash: ${hash}`);
    const keyLength = Buffer.from(hash, 'base64').length;
    const derivedKey = await pbkdf2(password, salt, parseInt(iterations), keyLength, 'sha256');
    return crypto.timingSafeEqual(Buffer.from(hash, 'base64'), derivedKey);
  } else if (hasher === 'unsalted_sha1') {
    const hash = crypto.createHash('sha1').update(password).digest('hex');
    return hash === encoded.split('$$')[1];
  }
  throw new Error('Hasher not supported');
};

const loginUser = async (req, res) => {
  // console.log(req.body);
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordCorrect = await verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Return user details along with the token
    res.status(200).json({
      token,
      name: user.username,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    // const userId = req.user._id;
    const user = await User.findOne({ email: req.user.email });
    console.log(user);
    const answers = await Answer.find({ user: user.user });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user, answers });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get User Answers
const getUserAnswers = async (req, res) => {
  try {
    console.log('req-answer', req);
    console.log('user', req.user.user);
    const answers = await Answer.find({ user: req.user.user });
    // console.log(answers);
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Update the user information
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true }
    );

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const profilePhotosDir = path.join(__dirname, '../../profile_photos');
if (!fs.existsSync(profilePhotosDir)) {
  fs.mkdirSync(profilePhotosDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profile_photos/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const updateProfilePicture = [
  upload.single('picture'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.picture = `profile_photos/${req.file.filename}`;
      await user.save();

      res.status(200).json({ picture: user.picture });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
];

export { registerUser, loginUser, getUserProfile, getUserAnswers, updateUser,updateProfilePicture };
