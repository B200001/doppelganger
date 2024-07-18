import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  user: {
    type: Number,
    required: true,
    unique: true, // Ensure uniqueness for user field
  },
  phone_no: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  pin: {
    type: String,
    // required: true,
  },
  affiliated_org: {
    type: String,
    required: true,
  },
  inspection_interest: {
    type: String,
    required: true,
  },
  work_hours: {
    type: String, // Keep as String
    required: true,
  },
  extra_work: {
    type: [String],
    required: true,
  },
  registration_date: {
    type: Date,
    required: true,
  },
  profile_slug: {
    type: String,
    // required: true,
  },
  picture: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness for email field
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
