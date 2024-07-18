import mongoose from 'mongoose';

const { Schema } = mongoose;

const answerSchema = new Schema({
  user: {
    type: Number,
    required: true,
  },
  dataset: {
    type: String,
    required: true,
  },
  image_name: {
    type: String,
    required: true,
  },
  listed_ans: {
    type: [String],
    required: true,
  },
  unlisted_ans: {
    type: String,
    required: true,
  },
  question_slug: {
    type: String,
    required: true,
  },
  ans_time: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
