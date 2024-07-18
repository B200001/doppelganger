import mongoose from 'mongoose';

const { Schema } = mongoose;

const removedImageSchema = new Schema({
  imageName: {
    type: String,
    required: true,
    unique: true,
  },
  removedAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      user: {
        type: Object,
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
        type: Array,
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
      createdAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

const RemovedImage = mongoose.model('RemovedImage', removedImageSchema);

export default RemovedImage;
