import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  countryCode: {
    type: String,
    default: '+254'
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['community_member', 'verified_expert_individual', 'verified_expert_org', 'admin'],
    default: 'community_member'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  reputation: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  avatar: {
    type: String
  },
  expertise: [{
    type: String
  }],
  location: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
